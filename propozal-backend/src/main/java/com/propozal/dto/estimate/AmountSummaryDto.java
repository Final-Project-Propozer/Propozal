package com.propozal.dto.estimate;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@Builder
public class AmountSummaryDto {
    private final BigDecimal supplyAmount;
    private final BigDecimal discountAmount;
    private final BigDecimal vatAmount;
    private final BigDecimal totalAmount;
}
