package com.propozal.service;

import com.propozal.domain.EmailVerification;
import com.propozal.domain.User;
import com.propozal.dto.user.LoginResponse;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.EmailVerificationRepository;
import com.propozal.repository.UserRepository;
import com.propozal.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void signup(String email, String password, String name, User.Role role) {
        String normalizedEmail = email.trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // ✅ 최고 관리자는 이메일 인증만 끝나면 활성화, 영업사원은 관리자 승인 필요
        boolean active = (role == User.Role.ADMIN);

        User user = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(password))
                .name(name)
                .role(role)
                .loginType(User.LoginType.LOCAL)
                .isActive(active)   // ADMIN → true, SALESPERSON → false
                .isVerified(false)  // 이메일 인증은 여전히 필요
                .build();
        userRepository.save(user);

        sendVerificationEmail(user.getId(), user.getEmail());
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        // 🔹 상태값 분기
        if (!user.isVerified() && !user.isActive()) {
            throw new CustomException(ErrorCode.EMAIL_AND_APPROVAL_REQUIRED);
        }
        if (!user.isVerified()) {
            throw new CustomException(ErrorCode.EMAIL_NOT_VERIFIED);
        }
        if (!user.isActive()) {
            throw new CustomException(ErrorCode.ACCOUNT_PENDING_APPROVAL);
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        return new LoginResponse(accessToken, refreshToken);
    }

    public String socialLogin(String provider, String authCode) {
        return "SOCIAL_LOGIN_SUCCESS";
    }

    public void requestPasswordReset(String email) {
    }

    public void verifyPasswordResetToken(String token) {
    }

    public void resetPassword(String token, String newPassword) {
    }

    public List<User> getPendingApprovals() {
        return userRepository.findByIsActiveFalse();
    }

    @Transactional
    public void approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.setActive(true);
        userRepository.save(user);
    }

    @Transactional
    public void sendVerificationEmail(Long userId, String email) {
        String token = UUID.randomUUID().toString();
        EmailVerification verification = EmailVerification.builder()
                .userId(userId)
                .email(email)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        emailVerificationRepository.save(verification);
        emailService.sendVerificationEmail(email, token);
    }

    @Transactional
    public void verifyEmail(String token) {
        EmailVerification verification = emailVerificationRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_TOKEN));
        if (verification.isUsed()) {
            throw new CustomException(ErrorCode.TOKEN_ALREADY_USED);
        }
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.TOKEN_EXPIRED);
        }
        User user = userRepository.findById(verification.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.setVerified(true);
        verification.setUsed(true);
        userRepository.save(user);
        emailVerificationRepository.save(verification);
    }
}
