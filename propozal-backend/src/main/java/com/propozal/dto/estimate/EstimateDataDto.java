package com.propozal.dto.estimate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class EstimateDataDto {
    private List<ItemDto> items;
    private int supplyAmount;
    private int discountAmount;
    private int vatAmount;
    private int totalAmount;
    private String specialTerms;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCompanyName;
    private String customerPosition;

    private Integer dealStatus;
    private LocalDate expirationDate;
    private LocalDate sentDate;
}
