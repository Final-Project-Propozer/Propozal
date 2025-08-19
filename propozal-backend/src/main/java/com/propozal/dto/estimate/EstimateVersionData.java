
package com.propozal.dto.estimate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class EstimateVersionData {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCompanyName;
    private String customerPosition;
    private String specialTerms;
    private BigDecimal totalAmount;
    private boolean vatIncluded;
    private LocalDate expirationDate;
    private Integer dealStatus;

    private List<EstimateItemData> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EstimateItemData {
        private String productName;
        private String productCode;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discountRate;
        private BigDecimal subtotal;
        private BigDecimal vatAmount;
        private Boolean isVatApplicable;
    }
}