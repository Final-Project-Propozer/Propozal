package com.propozal.repository;

import com.propozal.domain.Estimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, Long> {

    List<Estimate> findByUserIdAndDealStatusOrderByUpdatedAtDesc(Long userId, Integer dealStatus);

    List<Estimate> findByUserIdAndDealStatusNotOrderByUpdatedAtDesc(Long userId, Integer dealStatus);
}