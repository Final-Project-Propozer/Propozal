package com.propozal.domain;

import java.math.BigDecimal;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "products")
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_lv1_id", nullable = false)
    private Category categoryLv1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_lv2_id", nullable = false)
    private Category categoryLv2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_lv3_id")
    private Category categoryLv3;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String imageUrl;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal basePrice;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal maxDiscountRate = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean isVatApplicable = true;

    @Column(nullable = false)
    private boolean isDeleted = false;
}