package com.propozal.dto.admin;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    private Long id;
    private Long adminUserId;
    private String businessNumber;
    private String ceoName;
    private String companyName;
    private String address;
    private String contactPhone;
    private String businessType;
    private String businessItem;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}