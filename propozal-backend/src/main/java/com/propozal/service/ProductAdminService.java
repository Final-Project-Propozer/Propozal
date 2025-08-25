package com.propozal.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.propozal.domain.Category;
import com.propozal.domain.Product;
import com.propozal.dto.product.ProductCreateRequestDto;
import com.propozal.dto.product.ProductResponseDto;
import com.propozal.dto.product.ProductUpdateRequestDto;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.CategoryRepository;
import com.propozal.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductAdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductResponseDto createProduct(ProductCreateRequestDto request) {
        if (productRepository.existsByName(request.getName())) {
            throw new CustomException(ErrorCode.PRODUCT_ALREADY_EXISTS);
        }

        // 🟢 수정된 부분: DTO에서 받은 ID가 null이 아닐 경우에만 조회
        Category categoryLv1 = null;
        if (request.getCategoryLv1Id() != null) {
            categoryLv1 = categoryRepository.findById(request.getCategoryLv1Id())
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
        }

        Category categoryLv2 = null;
        if (request.getCategoryLv2Id() != null) {
            categoryLv2 = categoryRepository.findById(request.getCategoryLv2Id())
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
        }

        Category categoryLv3 = null;
        if (request.getCategoryLv3Id() != null) {
            categoryLv3 = categoryRepository.findById(request.getCategoryLv3Id())
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
        }

        Product product = Product.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getPrice())
                .categoryLv1(categoryLv1)
                .categoryLv2(categoryLv2)
                .categoryLv3(categoryLv3)
                .imageUrl(request.getImageUrl())
                .maxDiscountRate(BigDecimal.ZERO)
                .isVatApplicable(true)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        productRepository.save(product);
        return toResponse(product);
    }

    public List<ProductResponseDto> getProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
        return toResponse(product);
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductUpdateRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        product.setName(request.getName());
        product.setCode(request.getCode());

        product.setDescription(request.getDescription());
        product.setBasePrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setUpdatedAt(LocalDateTime.now());

        // 🟢 수정된 부분: getCategoryId() 대신 ProductUpdateRequestDto에 맞게 수정
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
            product.setCategoryLv3(category);
        }

        return toResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setIsDeleted(true);
    }

    private ProductResponseDto toResponse(Product product) {
        ProductResponseDto res = new ProductResponseDto();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setCode(product.getCode());
        res.setDescription(product.getDescription());
        res.setPrice(product.getBasePrice());
        res.setCategoryId(product.getCategoryLv3() != null ? product.getCategoryLv3().getId() : null);
        res.setImageUrl(product.getImageUrl());
        return res;
    }
}