package com.propozal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.propozal.domain.EstimateConfirmationToken;

@Repository
public interface EstimateConfirmationTokenRepository extends JpaRepository<EstimateConfirmationToken, Long> {
    Optional<EstimateConfirmationToken> findByToken(String token);
}
