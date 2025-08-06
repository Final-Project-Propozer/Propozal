package com.propozal.dto.estimate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.propozal.domain.Estimate;

import lombok.Getter;

@Getter
public class EstimateCreateResponse {
    private final Long id;
    private final String customerName;
    private final BigDecimal totalAmount;
    private final LocalDateTime createdAt;

    private EstimateCreateResponse(Estimate estimate) {
        this.id = estimate.getId();
        this.customerName = estimate.getCustomerName();
        this.totalAmount = estimate.getTotalAmount();
        this.createdAt = estimate.getCreatedAt();
    }

    public static EstimateCreateResponse from(Estimate estimate) {
        return new EstimateCreateResponse(estimate);
    }
}