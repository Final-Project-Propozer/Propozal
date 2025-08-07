// DashboardSummaryDto.java
package com.propozal.dto.admin;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private List<DashboardMonthlyPerformanceDto> monthlyPerformance;
    private List<DashboardCustomerPerformanceDto> customerPerformance;
    private List<DashboardSalesPersonPerformanceDto> salesPersonPerformance;
    private List<DashboardDelayedEstimatesDto> delayedEstimates;
    private DashboardStatusDistributionDto statusDistribution;
    private List<DashboardPopularProductsDto> popularProducts;
}