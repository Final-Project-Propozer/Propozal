package com.propozal.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.propozal.domain.Estimate;

@Repository
public interface EstimateAdminRepository extends JpaRepository<Estimate, Long> {

        @Query("SELECT e FROM Estimate e WHERE " +
                        "(:startDate IS NULL OR DATE(e.createdAt) >= :startDate) AND " +
                        "(:endDate IS NULL OR DATE(e.createdAt) <= :endDate) AND " +
                        "(:userId IS NULL OR e.user.id = :userId) AND " +
                        "(:customerName IS NULL OR e.customerName LIKE %:customerName%) AND " +
                        "(:customerCompanyName IS NULL OR e.customerCompanyName LIKE %:customerCompanyName%)")
        Page<Estimate> searchEstimates(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("userId") Long userId,
                        @Param("customerName") String customerName,
                        @Param("customerCompanyName") String customerCompanyName,
                        Pageable pageable);
}