package com.propozal.dto.estimate;

import com.propozal.domain.EstimateItem;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class EstimateItemResponse {

    private final Long id;
    private final String productName;
    private final String productCode;
    private final int quantity;
    private final BigDecimal unitPrice;
    private final BigDecimal discountRate;
    private final BigDecimal subtotal;

    public static EstimateItemResponse from(EstimateItem item) {
        return new EstimateItemResponse(item);
    }

    private EstimateItemResponse(EstimateItem item) {
        this.id = item.getId();
        this.productName = item.getProduct().getName();
        this.productCode = item.getProduct().getCode();
        this.quantity = item.getQuantity();
        this.unitPrice = item.getUnitPrice();
        this.discountRate = item.getDiscountRate();
        this.subtotal = item.getSubtotal();
    }
}