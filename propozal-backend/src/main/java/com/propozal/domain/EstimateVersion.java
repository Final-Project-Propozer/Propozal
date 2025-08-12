package com.propozal.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "estimate_versions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class EstimateVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    @Lob
    @Column(nullable = false)
    private String estimateData;

    @Column(nullable = false)
    private String savedBy;

    private String memo;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime savedAt;

    @Builder
    public EstimateVersion(Estimate estimate, String estimateData, String savedBy, String memo) {
        this.estimate = estimate;
        this.estimateData = estimateData;
        this.savedBy = savedBy;
        this.memo = memo;
    }
}