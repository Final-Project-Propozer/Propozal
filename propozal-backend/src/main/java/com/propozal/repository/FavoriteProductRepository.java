package com.propozal.repository;

import com.propozal.domain.FavoriteProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Long> {

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    List<FavoriteProduct> findAllByUserIdAndProductIdIn(Long userId, List<Long> productIds);

    Optional<FavoriteProduct> findByUserIdAndProductId(Long userId, Long productId);

    Page<FavoriteProduct> findAllByUserId(Long id, Pageable pageable);
}