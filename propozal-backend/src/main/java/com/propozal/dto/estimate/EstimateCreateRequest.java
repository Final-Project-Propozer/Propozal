package com.propozal.dto.estimate;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EstimateCreateRequest {

    @NotNull(message = "사용자 ID는 필수입니다.")
    private Long userId;

    @NotBlank(message = "고객명은 필수입니다.")
    private String customerName;

    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String customerEmail;

    private String customerPhone;

    private String customerCompanyName;

    private String customerPosition;

    @NotEmpty(message = "견적 품목은 최소 1개 이상이어야 합니다.")
    @Valid
    private List<ItemRequest> items;

    @Getter
    @NoArgsConstructor
    public static class ItemRequest {

        @NotNull(message = "상품 ID는 필수입니다.")
        private Long productId;

        @NotNull(message = "수량은 필수입니다.")
        @Positive(message = "수량은 1 이상이어야 합니다.")
        private Integer quantity;

        @NotNull(message = "할인율은 필수입니다.")
        @Min(value = 0, message = "할인율은 0 이상이어야 합니다.")
        @Max(value = 1, message = "할인율은 1 이하이어야 합니다.")
        private BigDecimal discountRate;
    }
}