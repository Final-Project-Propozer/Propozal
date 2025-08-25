package com.propozal.dto.admin;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DashboardCustomerPerformanceDto {
    private Long customerId;
    private String customerName;
    private String customerCompanyName;
    private Long estimateCount;
    private Long dealCount;
    private BigDecimal totalAmount;
    private BigDecimal dealAmount;
    private LocalDateTime lastEstimateDate;

    // JPA 네이티브 쿼리용 명시적 생성자 - LocalDateTime 대신 String으로 임시 테스트
    public DashboardCustomerPerformanceDto(
            Long customerId,
            String customerName, 
            String customerCompanyName,
            Long estimateCount,
            Long dealCount, 
            BigDecimal totalAmount,
            BigDecimal dealAmount,
            String lastEstimateDate) {  // String으로 변경
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerCompanyName = customerCompanyName;
        this.estimateCount = estimateCount;
        this.dealCount = dealCount;
        this.totalAmount = totalAmount;
        this.dealAmount = dealAmount;
        // String을 LocalDateTime으로 변환 (임시)
        this.lastEstimateDate = lastEstimateDate != null ? 
            LocalDateTime.parse(lastEstimateDate.replace(' ', 'T')) : null;
    }
}