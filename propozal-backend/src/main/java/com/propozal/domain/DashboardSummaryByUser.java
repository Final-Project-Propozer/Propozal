package com.propozal.domain;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_summary_by_user")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryByUser {

    @Id
    @Column(name = "user_id")
    private Long userId; // 사용자 ID (기본키이자 외래키)

    @NotNull
    @Column(name = "estimate_count", nullable = false)
    private Integer estimateCount; // 작성한 견적서 개수

    @NotNull
    @Column(name = "total_estimate_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalEstimateAmount; // 견적서 총액 합계 (정밀한 금액 계산을 위해 BigDecimal 사용)

    @NotNull
    @Column(name = "last_updated_at", nullable = false)
    private LocalDateTime lastUpdatedAt; // 마지막 업데이트 시간

    @PrePersist // 엔티티 저장/수정 시 자동으로 lastUpdatedAt 갱신
    @PreUpdate
    public void prePersist() {
        this.lastUpdatedAt = LocalDateTime.now();
    }
}