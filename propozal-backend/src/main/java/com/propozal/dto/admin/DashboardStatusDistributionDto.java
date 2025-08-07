package com.propozal.dto.admin;

import lombok.*;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatusDistributionDto {
    private Long totalEstimates;
    private Long pendingEstimates; // 거래 대기
    private Long completedEstimates; // 거래 성사
    private Long canceledEstimates; // 거래 취소
    private Map<String, Double> statusDistribution; // 상태별 비율
}