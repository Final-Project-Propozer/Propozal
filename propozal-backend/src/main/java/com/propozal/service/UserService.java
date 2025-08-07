package com.propozal.service;

import com.propozal.domain.User;
import com.propozal.dto.user.PendingUserResponse;
import com.propozal.dto.user.LoginRequest;
import com.propozal.dto.user.SignupRequest;
import com.propozal.dto.user.LoginResponse;
import com.propozal.jwt.JwtUtil;
import com.propozal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 가입된 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .role(request.getRole())
                .isVerified(false)
                .isActive(false)
                .build();

        userRepository.save(user);
    }

    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        if (!user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이메일 인증이 필요합니다.");
        }

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 승인이 필요합니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return new LoginResponse(accessToken, refreshToken);
    }

    public List<PendingUserResponse> getPendingUsers() {
        return userRepository.findByIsActiveFalse()
                .stream()
                .map(PendingUserResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다."));
        user.setActive(true);
    }
}
