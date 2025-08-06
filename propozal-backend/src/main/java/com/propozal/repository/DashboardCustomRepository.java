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
            COUNT(*) as estimateCount,
            SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) as dealCount,
            SUM(e.total_amount) as totalAmount,
            SUM(CASE WHEN e.deal_status = 2 THEN e.total_amount ELSE 0 END) as dealAmount,
            (SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversionRate
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
            e.customer_name as customerName,
            e.customer_company_name as customerCompanyName,
            COUNT(*) as estimateCount,
            SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) as dealCount,
            SUM(e.total_amount) as totalAmount,
            SUM(CASE WHEN e.deal_status = 2 THEN e.total_amount ELSE 0 END) as dealAmount,
            MAX(e.created_at) as lastEstimateDate
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
            u.id as userId,
            u.name as userName,
            COUNT(*) as estimateCount,
            SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) as dealCount,
            SUM(e.total_amount) as totalAmount,
            SUM(CASE WHEN e.deal_status = 2 THEN e.total_amount ELSE 0 END) as dealAmount,
            (SUM(CASE WHEN e.deal_status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversionRate,
            MAX(e.created_at) as lastEstimateDate
        FROM estimates e
        JOIN users u ON e.user_id = u.id
        WHERE e.created_at >= :startDate AND e.created_at <= :endDate
        GROUP BY u.id, u.name
        ORDER BY totalAmount DESC
        """, nativeQuery = true)
    List<DashboardSalesPersonPerformanceDto> getSalesPersonPerformance(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // 미확정/지연견적
    @Query(value = """
        SELECT
            e.id as estimateId,
            e.customer_name as customerName,
            e.customer_company_name as customerCompanyName,
            u.name as salesPersonName,
            e.expiration_date as expirationDate,
            DATEDIFF(CURDATE(), e.expiration_date) as daysOverdue,
            e.total_amount as amount,
            CASE e.deal_status
                WHEN 0 THEN '취소'
                WHEN 1 THEN '대기'
                WHEN 2 THEN '성사'
            END as status
        FROM estimates e
        JOIN users u ON e.user_id = u.id
        WHERE e.deal_status = 1
            AND e.expiration_date < CURDATE()
        ORDER BY e.expiration_date ASC
        """, nativeQuery = true)
    List<DashboardDelayedEstimatesDto> getDelayedEstimates();

    // 상태 분포
    @Query(value = """
        SELECT 
            COUNT(*) as totalEstimates,
            SUM(CASE WHEN deal_status = 1 THEN 1 ELSE 0 END) as pendingEstimates,
            SUM(CASE WHEN deal_status = 2 THEN 1 ELSE 0 END) as completedEstimates,
            SUM(CASE WHEN deal_status = 0 THEN 1 ELSE 0 END) as canceledEstimates
        FROM estimates
        WHERE created_at >= :startDate AND created_at <= :endDate
        """, nativeQuery = true)
    DashboardStatusDistributionDto getStatusDistribution(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}