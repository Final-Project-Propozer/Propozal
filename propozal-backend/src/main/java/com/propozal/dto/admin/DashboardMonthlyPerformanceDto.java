package com.propozal.dto.admin;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMonthlyPerformanceDto {
    private String month; // YYYY-MM 형식
    private Long estimateCount; // 견적서 건수
    private Long dealCount; // 거래 성사 건수
    private BigDecimal totalAmount; // 총 금액
    private BigDecimal dealAmount; // 거래 성사 금액
    private Double conversionRate; // 전환율 (거래성사건수/총견적건수)
}