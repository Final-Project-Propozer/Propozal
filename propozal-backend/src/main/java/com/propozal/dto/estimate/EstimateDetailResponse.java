package com.propozal.dto.estimate;

import com.propozal.domain.Estimate;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class EstimateDetailResponse {

    private final Long id;
    private final Long userId;
    private final String customerName;
    private final String customerEmail;
    private final String customerPhone;
    private final String customerCompanyName;
    private final String customerPosition;
    private final BigDecimal totalAmount;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final List<EstimateItemResponse> items;

    // Entity를 DTO로 변환하는 정적 팩토리 메서드
    public static EstimateDetailResponse from(Estimate estimate) {
        List<EstimateItemResponse> itemResponses = estimate.getEstimateItems().stream()
                .map(EstimateItemResponse::from)
                .collect(Collectors.toList());

        return new EstimateDetailResponse(estimate, itemResponses);
    }

    private EstimateDetailResponse(Estimate estimate, List<EstimateItemResponse> items) {
        this.id = estimate.getId();
        this.userId = estimate.getUserId();
        this.customerName = estimate.getCustomerName();
        this.customerEmail = estimate.getCustomerEmail();
        this.customerPhone = estimate.getCustomerPhone();
        this.customerCompanyName = estimate.getCustomerCompanyName();
        this.customerPosition = estimate.getCustomerPosition();
        this.totalAmount = estimate.getTotalAmount();
        this.createdAt = estimate.getCreatedAt();
        this.updatedAt = estimate.getUpdatedAt();
        this.items = items;
    }
}