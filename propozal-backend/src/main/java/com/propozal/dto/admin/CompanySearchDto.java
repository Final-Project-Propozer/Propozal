package com.propozal.dto.admin;

import lombok.*;
import org.springframework.data.domain.Pageable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanySearchDto {
    private String companyName;
    private String businessNumber;
    private String ceoName;
    private String address;
    private Pageable pageable;
}