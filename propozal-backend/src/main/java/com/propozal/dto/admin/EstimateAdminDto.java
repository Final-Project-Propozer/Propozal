package com.propozal.dto.admin;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstimateAdminDto {
    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCompanyName;
    private String customerPosition;
    private BigDecimal totalAmount;
    private Boolean vatIncluded;
    private String specialTerms;
    private Integer dealStatus;
    private LocalDate expirationDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}