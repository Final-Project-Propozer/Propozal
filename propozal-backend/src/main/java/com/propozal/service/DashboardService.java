// DashboardService.java
package com.propozal.service;

import com.propozal.dto.admin.*;
import com.propozal.repository.DashboardCustomRepository;
import com.propozal.repository.DashboardPopularProductsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardCustomRepository customRepository;
    private final DashboardPopularProductsRepository popularProductsRepository;

    // 월별 실적 집계
    public List<DashboardMonthlyPerformanceDto> getMonthlyPerformance(LocalDate startDate, LocalDate endDate) {
        return customRepository.getMonthlyPerformance(startDate, endDate);
    }

    // 고객별 실적
    public List<DashboardCustomerPerformanceDto> getCustomerPerformance(LocalDate startDate, LocalDate endDate) {
        return customRepository.getCustomerPerformance(startDate, endDate);
    }

    // 영업사원별 실적
    public List<DashboardSalesPersonPerformanceDto> getSalesPersonPerformance(LocalDate startDate, LocalDate endDate) {
        return customRepository.getSalesPersonPerformance(startDate, endDate);
    }

    // 미확정/지연견적
    public List<DashboardDelayedEstimatesDto> getDelayedEstimates() {
        return customRepository.getDelayedEstimates();
    }

    // 상태 분포
    public DashboardStatusDistributionDto getStatusDistribution(LocalDate startDate, LocalDate endDate) {
        return customRepository.getStatusDistribution(startDate, endDate);
    }

    // 업종 분포
    public List<DashboardIndustryDistributionDto> getIndustryDistribution() {
        return customRepository.getIndustryDistribution();
    }

    // 인기 제품
    public List<DashboardPopularProductsDto> getPopularProducts() {
        return popularProductsRepository.findTopPopularProducts()
                .stream()
                .map(p -> DashboardPopularProductsDto.builder()
                        .productId(p.getProductId())
                        .estimateCount(Long.valueOf(p.getEstimateCount()))
                        .totalQuantity(Long.valueOf(p.getTotalQuantity()))
                        .build())
                .toList();
    }

    // 실시간 대시보드 데이터
    public DashboardSummaryDto getDashboardSummary(LocalDate startDate, LocalDate endDate) {
        return DashboardSummaryDto.builder()
                .monthlyPerformance(getMonthlyPerformance(startDate, endDate))
                .customerPerformance(getCustomerPerformance(startDate, endDate))
                .salesPersonPerformance(getSalesPersonPerformance(startDate, endDate))
                .delayedEstimates(getDelayedEstimates())
                .statusDistribution(getStatusDistribution(startDate, endDate))
                .popularProducts(getPopularProducts())
                .build();
    }
}