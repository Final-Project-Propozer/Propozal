package com.propozal.domain;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "estimate_status_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstimateStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 상태 변경 및 이력 추적 고유 ID (기본키, 자동 증가)

    @NotNull
    @Column(name = "estimate_id", nullable = false)
    private Long estimateId; // 견적서 ID (외래키)

    @NotNull
    @Column(name = "previous_status", nullable = false)
    private Integer previousStatus; // 이전 상태 (0,1,2 등)

    @NotNull
    @Column(name = "new_status", nullable = false)
    private Integer newStatus; // 변경 된 상태

    @NotNull
    @Column(name = "changed_by", nullable = false, length = 50)
    private String changedBy; // 변경 주체 (예: 'CUSTOMER', 'SYSTEM', 'ADMIN') SYSTEM 인 경우 만료 일자 지나서 자동으로 견적서의 deal_status가 거래 취소로 바뀐 상황

    @Column(name = "changed_at")
    private LocalDateTime changedAt; // 변경 시간

    @PrePersist // 엔티티 저장 시 자동으로 changedAt 갱신
    public void prePersist() {
        if (this.changedAt == null) {
            this.changedAt = LocalDateTime.now();
        }
    }
}