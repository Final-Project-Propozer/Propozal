package com.propozal.repository;

import com.propozal.domain.EstimateItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstimateItemRepository extends JpaRepository<EstimateItem, Long> {
}