package com.propozal.service;

import com.propozal.config.PasswordPolicy;
import com.propozal.domain.EmailVerification;
import com.propozal.domain.User;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.EmailVerificationRepository;
import com.propozal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final int EXPIRE_MINUTES = 30;

    @Value("${app.base-url")
    private String appBaseUrl;

    public PasswordResetService(UserRepository userRepository,
                                EmailVerificationRepository emailVerificationRepository,
                                EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailVerificationRepository = emailVerificationRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void requestReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        LocalDateTime now = LocalDateTime.now();
        boolean existsValid = emailVerificationRepository
                .existsByEmailAndUsedFalseAndExpiresAtAfter(email, now);

        String token;
        if (existsValid) {
            EmailVerification latest = emailVerificationRepository
                    .findTopByEmailAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(email, now)
                    .orElse(null);
            token = latest != null ? latest.getToken() : issueToken(email);
        } else {
            token = issueToken(email);
        }

        String resetLink = buildBackendVerifyLink(token);
        emailService.sendPasswordResetMail(email, resetLink);
    }

    private String issueToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String token = "PR-" + UUID.randomUUID();
        EmailVerification ev = new EmailVerification();
        ev.setUserId(user.getId());
        ev.setEmail(email);
        ev.setToken(token);
        ev.setUsed(false);
        ev.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRE_MINUTES));
        emailVerificationRepository.save(ev);
        return token;
    }

    private String buildBackendVerifyLink(String token) {
        return "/password-reset?token=" + token;
    }

    @Transactional(readOnly = true)
    public void verifyToken(String token) {
        EmailVerification ev = emailVerificationRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_TOKEN));

        if (!token.startsWith("PR-")) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }
        if (Boolean.TRUE.equals(ev.isUsed())) {
            throw new CustomException(ErrorCode.TOKEN_ALREADY_USED);
        }
        if (ev.getExpiresAt() == null || ev.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.TOKEN_EXPIRED);
        }
    }

    @Transactional
    public void confirmReset(String token, String newPassword) {
        EmailVerification ev = emailVerificationRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_TOKEN));

        if (!token.startsWith("PR-")) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }
        if (Boolean.TRUE.equals(ev.isUsed())) {
            throw new CustomException(ErrorCode.TOKEN_ALREADY_USED);
        }
        if (ev.getExpiresAt() == null || ev.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.TOKEN_EXPIRED);
        }

        User user = userRepository.findByEmail(ev.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!PasswordPolicy.isValid(newPassword, user.getEmail())) {
            throw new CustomException(ErrorCode.PASSWORD_POLICY_VIOLATION);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        ev.setUsed(true);
        emailVerificationRepository.save(ev);
    }
}
