package com.propozal.dto.estimate;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class EstimateItemUpdateRequest {

    @NotNull(message = "수량은 필수입니다.")
    @Positive(message = "수량은 1 이상이어야 합니다.")
    private Integer quantity;

    @NotNull(message = "할인율은 필수입니다.")
    @Min(value = 0, message = "할인율은 0 이상이어야 합니다.")
    @Max(value = 1, message = "할인율은 1 이하이어야 합니다.")
    private BigDecimal discountRate;
}