package com.propozal.dto.product;

import com.propozal.dto.category.CategoryDto;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductUserResponseDto {
    private Long id;
    private String name;
    private String code;
    private String imageUrl;
    private BigDecimal basePrice;
    private boolean isFavorite;
    private String description;
    private CategoryDto category;
}