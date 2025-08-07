package com.propozal.repository;

import com.propozal.domain.DashboardSummaryByUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardSummaryByUserRepository extends JpaRepository<DashboardSummaryByUser, Long> {

    @Query("SELECT d FROM DashboardSummaryByUser d ORDER BY d.totalEstimateAmount DESC")
    List<DashboardSummaryByUser> findTopPerformingUsers();

    @Query("SELECT d FROM DashboardSummaryByUser d WHERE d.estimateCount > 0 ORDER BY d.totalEstimateAmount DESC")
    List<DashboardSummaryByUser> findActiveUsers();
}