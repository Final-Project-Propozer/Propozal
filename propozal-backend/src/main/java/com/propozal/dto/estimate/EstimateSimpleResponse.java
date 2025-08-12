package com.propozal.dto.estimate;

import com.propozal.domain.Estimate;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class EstimateSimpleResponse {
    private final Long id;
    private final String customerCompanyName;
    private final BigDecimal totalAmount;
    private final Integer dealStatus;
    private final LocalDateTime updatedAt;

    public EstimateSimpleResponse(Estimate estimate) {
        this.id = estimate.getId();
        this.customerCompanyName = estimate.getCustomerCompanyName();
        this.totalAmount = estimate.getTotalAmount();
        this.dealStatus = estimate.getDealStatus();
        this.updatedAt = estimate.getUpdatedAt();
    }
}
