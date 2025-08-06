package com.propozal.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "estimate_items")
public class EstimateItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private BigDecimal discountRate;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal unitPrice;

    private BigDecimal vatAmount;

    @Column(nullable = false)
    private BigDecimal subtotal;

    public void setEstimate(Estimate estimate) {
        this.estimate = estimate;
    }

    @Builder
    public EstimateItem(Product product, int quantity, BigDecimal unitPrice, BigDecimal discountRate, BigDecimal vatAmount, BigDecimal subtotal) {
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.discountRate = discountRate;
        this.vatAmount = vatAmount;
        this.subtotal = subtotal;
    }

    public void update(int quantity, BigDecimal discountRate) {
        this.quantity = quantity;
        this.discountRate = discountRate;
        
        // 소계(subtotal) 재계산
        BigDecimal supplyPrice = this.unitPrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal discountAmount = supplyPrice.multiply(discountRate);
        this.subtotal = supplyPrice.subtract(discountAmount);
        
        // 부가세(vatAmount) 재계산
        if (this.product != null && this.product.isVatApplicable()) {
            this.vatAmount = this.subtotal.multiply(new BigDecimal("0.1")).setScale(0, RoundingMode.DOWN);
        } else {
            this.vatAmount = BigDecimal.ZERO;
        }
    }
}