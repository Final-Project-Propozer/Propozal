package com.propozal.dto.estimate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EstimateCustomerUpdateRequest {

    @NotBlank(message = "고객명은 필수입니다.")
    private String customerName;

    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String customerEmail;
    
    private String customerPhone;
    
    private String customerCompanyName;
    
    private String customerPosition;
    
    // 견적서의 다른 필드(예: 특약사항)도 이 DTO에 추가하여 함께 수정할 수 있습니다.
    private String specialTerms;
}