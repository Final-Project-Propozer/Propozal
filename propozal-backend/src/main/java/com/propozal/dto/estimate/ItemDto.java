package com.propozal.dto.estimate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ItemDto {
    private Long id;
    private String productName;
    private String productCode;
    private int quantity;
    private int unitPrice;
    private double discountRate;
    private int subtotal;
}
