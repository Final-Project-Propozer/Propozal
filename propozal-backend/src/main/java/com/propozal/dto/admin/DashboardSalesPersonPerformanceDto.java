package com.propozal.dto.admin;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DashboardSalesPersonPerformanceDto {
    private Long userId;
    private String userName;
    private Long estimateCount;
    private Long dealCount;
    private BigDecimal totalAmount;
    private BigDecimal dealAmount;
    private Double conversionRate;
    private LocalDateTime lastEstimateDate;

    // JPA 네이티브 쿼리용 명시적 생성자 - LocalDateTime 대신 String으로 변경
    public DashboardSalesPersonPerformanceDto(
            Long userId,
            String userName,
            Long estimateCount,
            Long dealCount,
            BigDecimal totalAmount,
            BigDecimal dealAmount,
            Double conversionRate,
            String lastEstimateDate) {  // String으로 변경
        this.userId = userId;
        this.userName = userName;
        this.estimateCount = estimateCount;
        this.dealCount = dealCount;
        this.totalAmount = totalAmount;
        this.dealAmount = dealAmount;
        this.conversionRate = conversionRate;
        // String을 LocalDateTime으로 변환
        this.lastEstimateDate = lastEstimateDate != null ? 
            LocalDateTime.parse(lastEstimateDate.replace(' ', 'T')) : null;
    }
}