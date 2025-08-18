package com.propozal.service;

import com.propozal.domain.Estimate;
import com.propozal.domain.EstimateConfirmationToken;
import com.propozal.repository.EstimateConfirmationTokenRepository;
import com.propozal.repository.EstimateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConfirmationTokenService {

    private final EstimateRepository estimateRepository;
    private final EstimateConfirmationTokenRepository tokenRepository;

    @Transactional
    public String createConfirmationToken(Estimate estimate, EstimateConfirmationToken.ActionType actionType) {
        String tokenValue = UUID.randomUUID().toString();
        EstimateConfirmationToken token = EstimateConfirmationToken.builder()
                .estimate(estimate)
                .actionType(actionType)
                .token(tokenValue)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        tokenRepository.save(token);
        return tokenValue;
    }

    @Transactional
    public String processEstimateResponse(String tokenValue) {
        EstimateConfirmationToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new EntityNotFoundException("유효하지 않은 토큰입니다."));

        if (token.isUsed()) {
            return "이미 처리된 요청입니다.";
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            return "만료된 요청입니다.";
        }

        Estimate estimate = token.getEstimate();
        if (token.getActionType() == EstimateConfirmationToken.ActionType.ACCEPT) {
            estimate.setDealStatus(2); // 2: 거래 성사
        } else {
            estimate.setDealStatus(0); // 0: 거래 취소
        }
        token.useToken();

        estimateRepository.save(estimate);
        tokenRepository.save(token);

        return (token.getActionType() == EstimateConfirmationToken.ActionType.ACCEPT)
                ? "견적서가 성공적으로 승인되었습니다."
                : "견적서가 거절되었습니다. 소중한 의견 감사합니다.";
    }
}