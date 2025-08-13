package com.propozal.repository;

import com.propozal.domain.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByToken(String token);
    boolean existsByEmailAndUsedFalseAndExpiresAtAfter(String email, LocalDateTime now);
    Optional<EmailVerification> findTopByEmailAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(String email, LocalDateTime now);
}
