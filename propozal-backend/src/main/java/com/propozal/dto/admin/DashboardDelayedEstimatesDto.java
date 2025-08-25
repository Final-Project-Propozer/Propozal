package com.propozal.dto.admin;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.sql.Date;

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

    // JPA 네이티브 쿼리용 명시적 생성자 - java.sql.Date를 받아서 LocalDate로 변환
    public DashboardDelayedEstimatesDto(
            Long estimateId,
            String customerName,
            String customerCompanyName, 
            String salesPersonName,
            Date expirationDate,  // java.sql.Date로 변경
            Long daysOverdue,
            BigDecimal amount,
            String status) {
        this.estimateId = estimateId;
        this.customerName = customerName;
        this.customerCompanyName = customerCompanyName;
        this.salesPersonName = salesPersonName;
        this.expirationDate = expirationDate != null ? expirationDate.toLocalDate() : null; // LocalDate로 변환
        this.daysOverdue = daysOverdue;
        this.amount = amount;
        this.status = status;
    }
}