package com.propozal.repository;

import com.propozal.domain.FavoriteProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Long> {

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    List<FavoriteProduct> findAllByUserIdAndProductIdIn(Long userId, List<Long> productIds);

}