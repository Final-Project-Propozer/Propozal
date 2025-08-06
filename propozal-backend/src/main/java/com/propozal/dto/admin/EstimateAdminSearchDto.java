package com.propozal.dto.admin;

import lombok.*;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstimateAdminSearchDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long userId;
    private String customerName;
    private String customerCompanyName;
    private String productName;
    private Pageable pageable;
}