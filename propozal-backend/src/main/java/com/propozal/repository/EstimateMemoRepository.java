package com.propozal.repository;

import com.propozal.domain.EstimateMemo;
import com.propozal.domain.Estimate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstimateMemoRepository extends JpaRepository<EstimateMemo, Long> {
    List<EstimateMemo> findByEstimate(Estimate estimate);
}
