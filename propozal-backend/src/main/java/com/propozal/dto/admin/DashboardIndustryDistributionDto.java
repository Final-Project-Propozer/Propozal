package com.propozal.dto.admin;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardIndustryDistributionDto {
    private String industry;
    private Long customerCount;
}
