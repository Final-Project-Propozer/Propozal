package com.propozal.dto.estimate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

//@Getter
//@Setter
//@NoArgsConstructor
//public class EstimateDataDto {
//    private String customerName;
//    private String customerEmail;
//    private String customerPhone;
//    private String customerCompanyName;
//    private String customerPosition;
//    private String specialTerms; // ✅ 특약사항
//}
//

//@Getter
//@Setter
//@NoArgsConstructor
//public class EstimateDataDto {
//    private List<ItemDto> items;
//    private int supplyAmount;
//    private int discountAmount;
//    private int vatAmount;
//    private int totalAmount;
//    private String specialTerms;
//}

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

    // 고객 정보 필드 추가
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCompanyName;
    private String customerPosition;
}
