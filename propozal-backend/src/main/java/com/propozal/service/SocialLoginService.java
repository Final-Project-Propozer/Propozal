package com.propozal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.propozal.domain.User;
import com.propozal.domain.User.LoginType;
import com.propozal.domain.User.Role;
import com.propozal.dto.user.SocialLoginRequest;
import com.propozal.dto.user.LoginResponse;
import com.propozal.jwt.JwtUtil;
import com.propozal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocialLoginService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.token.uri}")
    private String kakaoTokenUri;

    @Value("${kakao.user-info.uri}")
    private String kakaoUserInfoUri;

    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public LoginResponse login(SocialLoginRequest request) {
        if ("kakao".equalsIgnoreCase(request.getProvider())) {
            return kakaoLogin(request.getAuthCode());
        }
        throw new RuntimeException("지원하지 않는 provider: " + request.getProvider());
    }

    private LoginResponse kakaoLogin(String authCode) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "grant_type=authorization_code" +
                    "&client_id=" + kakaoClientId +
                    "&redirect_uri=" + kakaoRedirectUri +
                    "&code=" + authCode;

            HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    kakaoTokenUri,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode tokenNode = objectMapper.readTree(response.getBody());
            String accessToken = tokenNode.get("access_token").asText();

            HttpHeaders userInfoHeaders = new HttpHeaders();
            userInfoHeaders.set("Authorization", "Bearer " + accessToken);

            HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);
            ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                    kakaoUserInfoUri,
                    HttpMethod.GET,
                    userInfoRequest,
                    String.class
            );

            JsonNode userNode = objectMapper.readTree(userInfoResponse.getBody());
            String kakaoId = userNode.get("id").asText();
            String email = null;
            String name = "카카오사용자";

            if (userNode.has("kakao_account")) {
                JsonNode account = userNode.get("kakao_account");
                if (account.has("email")) {
                    email = account.get("email").asText();
                }
                if (account.has("profile") && account.get("profile").has("nickname")) {
                    name = account.get("profile").get("nickname").asText();
                }
            }

            if (email == null) {
                email = "kakao_" + kakaoId + "@kakao.com";
            }

            Optional<User> optionalUser = userRepository.findByEmail(email);
            User user;
            if (optionalUser.isPresent()) {
                user = optionalUser.get();
            } else {
                user = User.builder()
                        .email(email)
                        .password("")
                        .name(name)
                        .role(Role.SALESPERSON)
                        .isActive(true)
                        .isVerified(true)
                        .loginType(LoginType.KAKAO)
                        .socialUserId(kakaoId)
                        .build();
                userRepository.save(user);
            }

            String jwtAccessToken = jwtUtil.generateAccessToken(user.getEmail());
            String jwtRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            return new LoginResponse(jwtAccessToken, jwtRefreshToken);

        } catch (Exception e) {
            throw new RuntimeException("카카오 로그인 실패: " + e.getMessage(), e);
        }
    }
}
