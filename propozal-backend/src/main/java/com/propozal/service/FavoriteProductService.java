package com.propozal.service;

import com.propozal.domain.FavoriteProduct;
import com.propozal.domain.Product;
import com.propozal.domain.User;
import com.propozal.dto.category.CategoryDto;
import com.propozal.dto.product.ProductUserResponseDto;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.FavoriteProductRepository;
import com.propozal.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteProductService {

    private final FavoriteProductRepository favoriteProductRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductUserResponseDto> getFavoriteProductsByUser(User user, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<FavoriteProduct> favoriteProductList = favoriteProductRepository.findAllByUserId(user.getId(), pageable);

        return favoriteProductList.map(fp -> {
            Product product = fp.getProduct();
            return ProductUserResponseDto.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .code(product.getCode())
                    .imageUrl(product.getImageUrl())
                    .basePrice(product.getBasePrice())
                    .isFavorite(true)
                    .description(product.getDescription())
                    .category(CategoryDto.builder()
                            .idLv1(product.getCategoryLv1() != null ? product.getCategoryLv1().getId() : null)
                            .nameLv1(product.getCategoryLv1() != null ? product.getCategoryLv1().getName() : null)
                            .idLv2(product.getCategoryLv2() != null ? product.getCategoryLv2().getId() : null)
                            .nameLv2(product.getCategoryLv2() != null ? product.getCategoryLv2().getName() : null)
                            .idLv3(product.getCategoryLv3() != null ? product.getCategoryLv3().getId() : null)
                            .nameLv3(product.getCategoryLv3() != null ? product.getCategoryLv3().getName() : null)
                            .build())
                    .build();
        });
    }

    @Transactional
    public void addFavoriteProduct(User user, Long productId) {
        if (favoriteProductRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalArgumentException("이미 즐겨찾기에 추가된 제품입니다.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        FavoriteProduct favoriteProduct = new FavoriteProduct();
        favoriteProduct.setUser(user);
        favoriteProduct.setProduct(product);
        favoriteProductRepository.save(favoriteProduct);
    }

    @Transactional
    public void removeFavoriteProduct(User user, Long productId) {
        FavoriteProduct favoriteProduct = favoriteProductRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
        favoriteProductRepository.delete(favoriteProduct);
    }
}
