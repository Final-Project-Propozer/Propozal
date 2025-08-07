package com.propozal.repository;

import com.propozal.domain.DashboardPopularProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DashboardPopularProductsRepository extends JpaRepository<DashboardPopularProducts, Long> {

    @Query("SELECT d FROM DashboardPopularProducts d ORDER BY d.estimateCount DESC")
    List<DashboardPopularProducts> findTopPopularProducts();

    @Query("SELECT d FROM DashboardPopularProducts d WHERE d.lastUpdatedAt >= :since ORDER BY d.estimateCount DESC")
    List<DashboardPopularProducts> findPopularProductsSince(@Param("since") LocalDateTime since);
}