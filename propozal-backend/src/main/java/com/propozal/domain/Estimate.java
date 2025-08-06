package com.propozal.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(nullable = false)
    private boolean vatIncluded = true;

    @Lob
    private String specialTerms;

    @Column(nullable = false)
    private Integer dealStatus = 1;

    private LocalDate expirationDate;

    @OneToMany(mappedBy = "estimate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EstimateItem> estimateItems = new ArrayList<>();

    @Builder
    public Estimate(Long userId, String customerName, String customerEmail, String customerPhone,
                    String customerCompanyName, String customerPosition, BigDecimal totalAmount, boolean vatIncluded,
                    String specialTerms, Integer dealStatus, LocalDate expirationDate, List<EstimateItem> estimateItems) {
        this.userId = userId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.customerCompanyName = customerCompanyName;
        this.customerPosition = customerPosition;
        this.totalAmount = totalAmount;
        this.vatIncluded = vatIncluded;
        this.specialTerms = specialTerms;
        this.dealStatus = dealStatus;
        this.expirationDate = expirationDate;

        if (estimateItems != null) {
            estimateItems.forEach(item -> item.setEstimate(this));
            this.estimateItems = estimateItems;
        }
    }

    /**
     * 견적서에 새로운 품목을 추가하고 총액을 업데이트합니다.
     *
     * @param newItem 추가할 견적 품목
     */
    public void addItem(EstimateItem newItem) {
        this.estimateItems.add(newItem);
        newItem.setEstimate(this);
        recalculateTotalAmount();
    }

    // 총액을 다시 계산하는 private 메서드
    public void recalculateTotalAmount() {
        this.totalAmount = this.estimateItems.stream()
                .map(EstimateItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void updateCustomerInfo(String customerName, String customerEmail, String customerPhone,
                                   String customerCompanyName, String customerPosition, String specialTerms) {
        // 요청으로 들어온 값이 null이 아닐 경우에만 필드를 업데이트합니다.
        if (customerName != null) {
            this.customerName = customerName;
        }
        if (customerEmail != null) {
            this.customerEmail = customerEmail;
        }
        if (customerPhone != null) {
            this.customerPhone = customerPhone;
        }
        if (customerCompanyName != null) {
            this.customerCompanyName = customerCompanyName;
        }
        if (customerPosition != null) {
            this.customerPosition = customerPosition;
        }
        if (specialTerms != null) {
            this.specialTerms = specialTerms;
        }
    }

    public void removeItem(EstimateItem item) {
        this.estimateItems.remove(item);
        recalculateTotalAmount();
    }
}