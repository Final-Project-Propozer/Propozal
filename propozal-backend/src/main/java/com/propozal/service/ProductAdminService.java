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

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getPrice())
                .categoryLv3(category)
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
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setUpdatedAt(LocalDateTime.now());

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
        res.setDescription(product.getDescription());
        res.setPrice(product.getBasePrice());
        res.setCategoryId(product.getCategoryLv3() != null ? product.getCategoryLv3().getId() : null);
        res.setImageUrl(product.getImageUrl());
        return res;
    }
}
