package com.propozal.dto.detail;

import com.propozal.domain.Estimate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class EstimateDetailDto {
    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCompanyName;
    private String customerPosition;
    private BigDecimal totalAmount;
    private boolean vatIncluded;
    private String specialTerms;
    private Integer dealStatus;
    private LocalDate expirationDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<EstimateItemDetailDto> estimateItems;

    public EstimateDetailDto(Estimate estimate) {
        this.id = estimate.getId();
        this.userId = estimate.getUser().getId();
        this.customerName = estimate.getCustomerName();
        this.customerEmail = estimate.getCustomerEmail();
        this.customerPhone = estimate.getCustomerPhone();
        this.customerCompanyName = estimate.getCustomerCompanyName();
        this.customerPosition = estimate.getCustomerPosition();
        this.totalAmount = estimate.getTotalAmount();
        this.vatIncluded = estimate.isVatIncluded();
        this.specialTerms = estimate.getSpecialTerms();
        this.dealStatus = estimate.getDealStatus();
        this.expirationDate = estimate.getExpirationDate();
        this.createdAt = estimate.getCreatedAt();
        this.updatedAt = estimate.getUpdatedAt();
        this.estimateItems = estimate.getEstimateItems().stream()
                .map(EstimateItemDetailDto::new)
                .collect(Collectors.toList());
    }
}