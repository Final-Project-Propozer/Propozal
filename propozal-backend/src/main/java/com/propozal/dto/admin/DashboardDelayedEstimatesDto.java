package com.propozal.dto.admin;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class DashboardDelayedEstimatesDto {
    private Long estimateId;
    private String customerName;
    private String customerCompanyName;
    private String salesPersonName;
    private LocalDate expirationDate;
    private Long daysOverdue;
    private BigDecimal amount;
    private String status;

    // JPA 네이티브 쿼리용 명시적 생성자
    public DashboardDelayedEstimatesDto(
            Long estimateId,
            String customerName,
            String customerCompanyName, 
            String salesPersonName,
            LocalDate expirationDate,
            Long daysOverdue,
            BigDecimal amount,
            String status) {
        this.estimateId = estimateId;
        this.customerName = customerName;
        this.customerCompanyName = customerCompanyName;
        this.salesPersonName = salesPersonName;
        this.expirationDate = expirationDate;
        this.daysOverdue = daysOverdue;
        this.amount = amount;
        this.status = status;
    }
}