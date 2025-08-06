// DashboardController.java
package com.propozal.controller;

import com.propozal.dto.admin.*;
import com.propozal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // 월별 실적
    @GetMapping("/monthly-performance")
    public ResponseEntity<List<DashboardMonthlyPerformanceDto>> getMonthlyPerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(12);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        return ResponseEntity.ok(dashboardService.getMonthlyPerformance(start, end));
    }

    // 고객별 실적
    @GetMapping("/customer-performance")
    public ResponseEntity<List<DashboardCustomerPerformanceDto>> getCustomerPerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(3);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        return ResponseEntity.ok(dashboardService.getCustomerPerformance(start, end));
    }

    // 영업사원별 실적
    @GetMapping("/sales-person-performance")
    public ResponseEntity<List<DashboardSalesPersonPerformanceDto>> getSalesPersonPerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(3);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        return ResponseEntity.ok(dashboardService.getSalesPersonPerformance(start, end));
    }

    // 미확정/지연견적
    @GetMapping("/delayed-estimates")
    public ResponseEntity<List<DashboardDelayedEstimatesDto>> getDelayedEstimates() {
        return ResponseEntity.ok(dashboardService.getDelayedEstimates());
    }

    // 상태 분포
    @GetMapping("/status-distribution")
    public ResponseEntity<DashboardStatusDistributionDto> getStatusDistribution(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(3);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        return ResponseEntity.ok(dashboardService.getStatusDistribution(start, end));
    }

    // 인기 제품
    @GetMapping("/popular-products")
    public ResponseEntity<List<DashboardPopularProductsDto>> getPopularProducts() {
        return ResponseEntity.ok(dashboardService.getPopularProducts());
    }

    // 대시보드 종합 데이터
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(3);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        return ResponseEntity.ok(dashboardService.getDashboardSummary(start, end));
    }

    // 필터/검색 기능
    @GetMapping("/search")
    public ResponseEntity<DashboardSummaryDto> searchDashboard(
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String salesPerson,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount) {

        // 검색 로직 구현
        return ResponseEntity.ok(dashboardService.getDashboardSummary(startDate, endDate));
    }
}