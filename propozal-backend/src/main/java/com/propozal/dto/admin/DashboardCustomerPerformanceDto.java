package com.propozal.dto.admin;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardCustomerPerformanceDto {
    private Long customerId;
    private String customerName;
    private String customerCompanyName;
    private Long estimateCount;
    private Long dealCount;
    private BigDecimal totalAmount;
    private BigDecimal dealAmount;
    private LocalDateTime lastEstimateDate;
}