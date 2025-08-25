package com.propozal.dto.admin;

import lombok.*;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
public class DashboardStatusDistributionDto {
    private Long totalEstimates;
    private Long pendingEstimates; // 거래 대기
    private Long completedEstimates; // 거래 성사
    private Long canceledEstimates; // 거래 취소
    private Map<String, Double> statusDistribution; // 상태별 비율

    // JPA 네이티브 쿼리용 명시적 생성자 (4개 파라미터만 받고 statusDistribution은 내부 계산)
    public DashboardStatusDistributionDto(
            Long totalEstimates,
            Long pendingEstimates,
            Long completedEstimates,
            Long canceledEstimates) {
        this.totalEstimates = totalEstimates;
        this.pendingEstimates = pendingEstimates;
        this.completedEstimates = completedEstimates;
        this.canceledEstimates = canceledEstimates;
        
        // statusDistribution Map 내부 계산
        this.statusDistribution = new HashMap<>();
        if (totalEstimates != null && totalEstimates > 0) {
            this.statusDistribution.put("pending", (pendingEstimates != null ? pendingEstimates : 0) * 100.0 / totalEstimates);
            this.statusDistribution.put("completed", (completedEstimates != null ? completedEstimates : 0) * 100.0 / totalEstimates);
            this.statusDistribution.put("canceled", (canceledEstimates != null ? canceledEstimates : 0) * 100.0 / totalEstimates);
        } else {
            this.statusDistribution.put("pending", 0.0);
            this.statusDistribution.put("completed", 0.0);
            this.statusDistribution.put("canceled", 0.0);
        }
    }
}