package com.propozal.repository;

import com.propozal.domain.Estimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, Long> {

    @Query("SELECT e FROM Estimate e " +
            "LEFT JOIN FETCH e.estimateItems ei " +
            "LEFT JOIN FETCH ei.product " +
            "WHERE e.id = :id")
    Optional<Estimate> findByIdWithItems(@Param("id") Long id);

    List<Estimate> findByUserIdAndDealStatusOrderByUpdatedAtDesc(Long userId, Integer dealStatus);

    List<Estimate> findByUserIdAndDealStatusNotOrderByUpdatedAtDesc(Long userId, Integer dealStatus);
}