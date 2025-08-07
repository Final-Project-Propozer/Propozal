package com.propozal.dto.admin;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSalesPersonPerformanceDto {
    private Long userId;
    private String userName;
    private Long estimateCount;
    private Long dealCount;
    private BigDecimal totalAmount;
    private BigDecimal dealAmount;
    private Double conversionRate;
    private LocalDateTime lastEstimateDate;
}