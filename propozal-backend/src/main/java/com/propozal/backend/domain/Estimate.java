package com.propozal.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "estimates")
public class Estimate extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private String customerCompanyName;

    private String customerPosition;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "estimate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EstimateItem> estimateItems = new ArrayList<>();

    @Builder
    public Estimate(Long userId, String customerName, String customerEmail, String customerPhone, String customerCompanyName, String customerPosition, BigDecimal totalAmount, List<EstimateItem> estimateItems) {
        this.userId = userId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.customerCompanyName = customerCompanyName;
        this.customerPosition = customerPosition;
        this.totalAmount = totalAmount;

        estimateItems.forEach(item -> item.setEstimate(this));
        this.estimateItems = estimateItems;
    }
}