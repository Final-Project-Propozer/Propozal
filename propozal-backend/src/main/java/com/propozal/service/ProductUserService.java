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
    public List<ProductUserResponseDto> getAllProducts(User user) {
        List<Product> products = productRepository.findAll();

        List<Long> productIds = products.stream().map(Product::getId).collect(Collectors.toList());

        //현재 사용자가 즐겨찾기한 제품 ID만 한꺼번에 추출
        Set<Long> favoriteProductIds = favoriteProductRepository
                .findAllByUserIdAndProductIdIn(user.getId(), productIds)
                .stream()
                .map(fp -> fp.getProduct().getId())
                .collect(Collectors.toSet());

        // 제품 목록을 ProductResponse DTO 리스트로 변환
        return products.stream().map(product -> ProductUserResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .code(product.getCode())
                .imageUrl(product.getImageUrl())
                .basePrice(product.getBasePrice())
                .isFavorite(favoriteProductIds.contains(product.getId()))
                .category(CategoryDto.builder()
                        .idLv1(product.getCategoryLv1().getId())
                        .nameLv1(product.getCategoryLv1().getName())
                        .idLv2(product.getCategoryLv2().getId())
                        .nameLv2(product.getCategoryLv2().getName())
                        .idLv3(product.getCategoryLv3().getId())
                        .nameLv3(product.getCategoryLv3().getName())
                        .build())
                .build()).collect(Collectors.toList());
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
                        .idLv1(product.getCategoryLv1().getId())
                        .nameLv1(product.getCategoryLv1().getName())
                        .idLv2(product.getCategoryLv2().getId())
                        .nameLv2(product.getCategoryLv2().getName())
                        .idLv3(product.getCategoryLv3().getId())
                        .nameLv3(product.getCategoryLv3().getName()).build())
                .build();

    }

}