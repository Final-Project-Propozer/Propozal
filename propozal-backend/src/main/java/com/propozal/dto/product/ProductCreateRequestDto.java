package com.propozal.dto.product;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductCreateRequestDto {
    private String name;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private String imageUrl;
}
