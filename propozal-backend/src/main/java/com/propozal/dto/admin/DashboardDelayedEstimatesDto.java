package com.propozal.dto.admin;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDelayedEstimatesDto {
    private Long estimateId;
    private String customerName;
    private String customerCompanyName;
    private String salesPersonName;
    private LocalDate expirationDate;
    private Long daysOverdue;
    private BigDecimal amount;
    private String status;
}