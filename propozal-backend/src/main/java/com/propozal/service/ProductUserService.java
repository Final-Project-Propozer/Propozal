package com.propozal.service;

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
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductUserService {

    private final ProductRepository productRepository;
    private final FavoriteProductRepository favoriteProductRepository;

    //전체 목록 조회
    @Transactional(readOnly = true)
    public Page<ProductUserResponseDto> getAllProducts(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("code"));
        Page<Product> productPage = productRepository.findAll(pageable);

        List<Long> productIds = productPage.getContent().stream()
                .map(Product::getId)
                .collect(Collectors.toList());

        Set<Long> favoriteProductIds = favoriteProductRepository
                .findAllByUserIdAndProductIdIn(user.getId(), productIds)
                .stream()
                .map(fp -> fp.getProduct().getId())
                .collect(Collectors.toSet());

        return productPage.map(product -> ProductUserResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .code(product.getCode())
                .imageUrl(product.getImageUrl())
                .basePrice(product.getBasePrice())
                .isFavorite(favoriteProductIds.contains(product.getId()))
                .category(CategoryDto.builder()
                        .idLv1(product.getCategoryLv1() != null ? product.getCategoryLv1().getId() : null)
                        .nameLv1(product.getCategoryLv1() != null ? product.getCategoryLv1().getName() : null)
                        .idLv2(product.getCategoryLv2() != null ? product.getCategoryLv2().getId() : null)
                        .nameLv2(product.getCategoryLv2() != null ? product.getCategoryLv2().getName() : null)
                        .idLv3(product.getCategoryLv3() != null ? product.getCategoryLv3().getId() : null)
                        .nameLv3(product.getCategoryLv3() != null ? product.getCategoryLv3().getName() : null)
                        .build())
                .build());
    }


    //제품 상세 조회
    @Transactional(readOnly = true)
    public ProductUserResponseDto getProductDetail(Long id, User user) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        boolean isFavorite = favoriteProductRepository.existsByUserIdAndProductId(user.getId(), product.getId());

        return ProductUserResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .code(product.getCode())
                .imageUrl(product.getImageUrl())
                .basePrice(product.getBasePrice())
                .isFavorite(isFavorite)
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

    }

}