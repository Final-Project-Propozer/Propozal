package com.propozal.repository;

import com.propozal.domain.EstimateVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstimateVersionRepository extends JpaRepository<EstimateVersion, Long> {
    // 특정 견적서의 모든 버전을 조회 (최신순으로)
    List<EstimateVersion> findByEstimateIdOrderBySavedAtDesc(Long estimateId);
}