// DashboardCustomRepository.java
package com.propozal.repository;

import com.propozal.domain.Company;
import com.propozal.domain.DashboardSummaryByUser;
import com.propozal.dto.admin.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DashboardCustomRepository extends JpaRepository<DashboardSummaryByUser, Long> {

    // 월별 실적 집계
    @Query(value = """
        SELECT
            DATE_FORMAT(e.created_at, '%Y-%m') as month,
            CAST(COUNT(*) AS SIGNED) as estimateCount,
            CAST(SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) AS SIGNED) as dealCount,
            CAST(SUM(e.total_amount) AS DECIMAL(15,2)) as totalAmount,
            CAST(SUM(CASE WHEN e.deal_status = 2 THEN e.total_amount ELSE 0 END) AS DECIMAL(15,2)) as dealAmount,
            CAST((SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS DOUBLE) as conversionRate
        FROM estimates e
        WHERE e.created_at >= :startDate AND e.created_at <= :endDate
        GROUP BY DATE_FORMAT(e.created_at, '%Y-%m')
        ORDER BY month
        """, nativeQuery = true)
    List<DashboardMonthlyPerformanceDto> getMonthlyPerformance(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // 고객별 실적
    @Query(value = """
        SELECT
            CAST(ROW_NUMBER() OVER (ORDER BY SUM(e.total_amount) DESC) AS SIGNED) as customerId,
            e.customer_name as customerName,
            e.customer_company_name as customerCompanyName,
            CAST(COUNT(*) AS SIGNED) as estimateCount,
            CAST(SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) AS SIGNED) as dealCount,
            CAST(SUM(e.total_amount) AS DECIMAL(15,2)) as totalAmount,
            CAST(SUM(CASE WHEN e.deal_status = 2 THEN e.total_amount ELSE 0 END) AS DECIMAL(15,2)) as dealAmount,
            DATE_FORMAT(MAX(e.created_at), '%Y-%m-%d %H:%i:%s') as lastEstimateDate
        FROM estimates e
        WHERE e.created_at >= :startDate AND e.created_at <= :endDate
        GROUP BY e.customer_name, e.customer_company_name
        ORDER BY totalAmount DESC
        """, nativeQuery = true)
    List<DashboardCustomerPerformanceDto> getCustomerPerformance(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // 영업사원별 실적
    @Query(value = """
        SELECT
            CAST(u.id AS SIGNED) as userId,
            u.name as userName,
            CAST(COUNT(*) AS SIGNED) as estimateCount,
            CAST(SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) AS SIGNED) as dealCount,
            CAST(SUM(e.total_amount) AS DECIMAL(15,2)) as totalAmount,
            CAST(SUM(CASE WHEN e.deal_status = 2 THEN e.total_amount ELSE 0 END) AS DECIMAL(15,2)) as dealAmount,
            CAST((SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS DOUBLE) as conversionRate,
            DATE_FORMAT(MAX(e.created_at), '%Y-%m-%d %H:%i:%s') as lastEstimateDate
        FROM estimates e
        JOIN users u ON e.user_id = u.id
        WHERE e.created_at >= :startDate AND e.created_at <= :endDate
        GROUP BY u.id, u.name
        ORDER BY totalAmount DESC
        """, nativeQuery = true)
    List<DashboardSalesPersonPerformanceDto> getSalesPersonPerformance(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // 업종 분포
    @Query(value = """
        SELECT
            c.industry as industry,
            CAST(COUNT(*) AS SIGNED) as customerCount
        FROM customers c
        WHERE c.industry IS NOT NULL AND c.industry <> ''
        GROUP BY c.industry
        ORDER BY customerCount DESC
        """, nativeQuery = true)
    List<DashboardIndustryDistributionDto> getIndustryDistribution();

    // 미확정/지연견적 - 임시로 30일 이내 만료 예정 견적 표시
    @Query(value = """
        SELECT
            CAST(e.id AS SIGNED) as estimateId,
            e.customer_name as customerName,
            e.customer_company_name as customerCompanyName,
            COALESCE(u.name, 'N/A') as salesPersonName,
            CAST(e.expiration_date AS DATE) as expirationDate,
            CAST(DATEDIFF(e.expiration_date, CURDATE()) AS SIGNED) as daysOverdue,
            CAST(e.total_amount AS DECIMAL(15,2)) as amount,
            CASE e.deal_status
                WHEN 0 THEN '취소'
                WHEN 1 THEN '대기'
                WHEN 2 THEN '성사'
            END as status
        FROM estimates e
        LEFT JOIN users u ON e.user_id = u.id
        WHERE e.deal_status = 1
            AND e.expiration_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY e.expiration_date ASC
        """, nativeQuery = true)
    List<DashboardDelayedEstimatesDto> getDelayedEstimates();

    // 상태 분포
    @Query(value = """
        SELECT 
            CAST(COUNT(*) AS SIGNED) as totalEstimates,
            CAST(SUM(CASE WHEN deal_status = 1 THEN 1 ELSE 0 END) AS SIGNED) as pendingEstimates,
            CAST(SUM(CASE WHEN deal_status = 2 THEN 1 ELSE 0 END) AS SIGNED) as completedEstimates,
            CAST(SUM(CASE WHEN deal_status = 0 THEN 1 ELSE 0 END) AS SIGNED) as canceledEstimates
        FROM estimates
        WHERE created_at >= :startDate AND created_at <= :endDate
        """, nativeQuery = true)
    DashboardStatusDistributionDto getStatusDistribution(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}