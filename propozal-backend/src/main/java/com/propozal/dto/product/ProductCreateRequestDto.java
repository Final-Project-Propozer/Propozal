package com.propozal.dto.product;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductCreateRequestDto {
    private String name;
    private String code;
    private String description;
    private BigDecimal price;
    private Long categoryLv1Id;
    private Long categoryLv2Id;
    private Long categoryLv3Id;
    private String imageUrl;
}
