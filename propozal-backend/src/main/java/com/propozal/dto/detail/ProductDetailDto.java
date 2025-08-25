package com.propozal.dto.detail;

import com.propozal.domain.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class ProductDetailDto {
    private Long id;
    private String name;
    private String code;
    private BigDecimal basePrice;
    private CategoryDetailDto categoryLv1;
    private CategoryDetailDto categoryLv2;
    private CategoryDetailDto categoryLv3;

    public ProductDetailDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.code = product.getCode();
        this.basePrice = product.getBasePrice();
        this.categoryLv1 = new CategoryDetailDto(product.getCategoryLv1());
        this.categoryLv2 = new CategoryDetailDto(product.getCategoryLv2());
        this.categoryLv3 = new CategoryDetailDto(product.getCategoryLv3());
    }
}