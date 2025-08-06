package com.propozal.dto.admin;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardPopularProductsDto {
    private Long productId;
    private String productName;
    private String productCode;
    private Long estimateCount;
    private Long totalQuantity;
    private BigDecimal totalAmount;
}