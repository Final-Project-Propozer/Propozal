package com.propozal.dto.detail;

import com.propozal.domain.EstimateItem;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class EstimateItemDetailDto {
    private Long id;
    private ProductDetailDto product;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountRate;
    private BigDecimal subtotal;

    public EstimateItemDetailDto(EstimateItem item) {
        this.id = item.getId();
        this.product = new ProductDetailDto(item.getProduct());
        this.quantity = item.getQuantity();
        this.unitPrice = item.getUnitPrice();
        this.discountRate = item.getDiscountRate();
        this.subtotal = item.getSubtotal();
    }
}