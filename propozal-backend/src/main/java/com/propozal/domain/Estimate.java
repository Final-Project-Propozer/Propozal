package com.propozal.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

    @Column(name = "sent_date")
    private LocalDate sentDate;

    @JsonManagedReference
    @OneToMany(mappedBy = "estimate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EstimateItem> estimateItems = new ArrayList<>();

    @Builder
    public Estimate(User user, String customerName, String customerEmail, String customerPhone,
            String customerCompanyName, String customerPosition, BigDecimal totalAmount, boolean vatIncluded,
            String specialTerms, Integer dealStatus, LocalDate expirationDate, LocalDate sentDate,
            List<EstimateItem> estimateItems) {

        this.user = user;
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
        this.sentDate = sentDate;

        if (estimateItems != null) {
            estimateItems.forEach(item -> item.setEstimate(this));
            this.estimateItems = estimateItems;
        }
    }

    public void addItem(EstimateItem newItem) {
        this.estimateItems.add(newItem);
        newItem.setEstimate(this);
        recalculateTotalAmount();
    }

    public void recalculateTotalAmount() {
        this.totalAmount = this.estimateItems.stream()
                .map(EstimateItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void updateCustomerInfo(String customerName, String customerEmail, String customerPhone,
            String customerCompanyName, String customerPosition, String specialTerms,
            Integer dealStatus, LocalDate expirationDate, LocalDate sentDate) {
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
        if (dealStatus != null) {
            this.dealStatus = dealStatus;
        }
        if (expirationDate != null) {
            this.expirationDate = expirationDate;
        }
        if (sentDate != null) {
            this.sentDate = sentDate;
        }
    }

    public void removeItem(EstimateItem item) {
        this.estimateItems.remove(item);
        recalculateTotalAmount();
    }

    public void setDealStatus(Integer dealStatus) {
        this.dealStatus = dealStatus;
    }

    public void setSentDate(LocalDate sentDate) {
        this.sentDate = sentDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
}
