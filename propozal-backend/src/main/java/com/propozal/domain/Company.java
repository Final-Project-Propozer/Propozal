package com.propozal.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "admin_user_id", nullable = false, unique = true)
    private Long adminUserId;

    @Column(name = "business_number", nullable = false, length = 50)
    private String businessNumber;

    @Column(name = "ceo_name", nullable = false, length = 100)
    private String ceoName;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    @Column(name = "business_type", length = 100)
    private String businessType; // 업태

    @Column(name = "business_item", length = 100)
    private String businessItem; // 업종

    @Column(name = "bank_name", length = 100)
    private String bankName; // 은행명

    @Column(name = "account_number", length = 50)
    private String accountNumber; // 계좌번호

    @Column(name = "account_holder", length = 100)
    private String accountHolder; // 예금주

    @Column(name = "created_at")
    private LocalDateTime createdAt; // 생성 시간

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 수정 시간

    @PrePersist // 엔티티 저장/수정 시 자동으로 시간 갱신
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate // 엔티티 저장/수정 시 자동으로 시간 갱신
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}