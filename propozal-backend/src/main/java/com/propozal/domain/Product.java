package com.propozal.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_lv1_id")
    private Category categoryLv1;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_lv2_id")
    private Category categoryLv2;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_lv3_id")
    private Category categoryLv3;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "max_discount_rate", nullable = false)
    private BigDecimal maxDiscountRate;

    @Column(name = "is_vat_applicable", nullable = false)
    private Boolean isVatApplicable;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
