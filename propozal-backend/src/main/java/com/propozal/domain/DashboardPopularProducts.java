package com.propozal.domain;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_popular_products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardPopularProducts {

    @Id
    @Column(name = "product_id")
    private Long productId; // 제품 ID (기본키이자 외래키)

    @NotNull
    @Column(name = "estimate_count", nullable = false)
    private Integer estimateCount; // 견적서에 포함된 횟수

    @NotNull
    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity; // 견적서에 포함된 총 수량

    @NotNull
    @Column(name = "last_updated_at", nullable = false)
    private LocalDateTime lastUpdatedAt; // 집계된 시간

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.lastUpdatedAt = LocalDateTime.now();
    }
}