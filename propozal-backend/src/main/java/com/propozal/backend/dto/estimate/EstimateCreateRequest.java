package com.propozal.backend.dto.estimate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

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

        @NotBlank(message = "상품명은 필수입니다.")
        private String productName;

        @NotNull(message = "수량은 필수입니다.")
        @Positive(message = "수량은 1 이상이어야 합니다.")
        private Integer quantity;

        @NotNull(message = "단가는 필수입니다.")
        @Positive(message = "단가는 0보다 커야 합니다.")
        private BigDecimal unitPrice;
    }
}