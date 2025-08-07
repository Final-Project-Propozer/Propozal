package com.propozal.dto.admin;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUpdateRequestDto {

    @NotBlank(message = "사업자등록번호는 필수입니다")
    @Pattern(regexp = "\\d{3}-\\d{2}-\\d{5}", message = "사업자등록번호 형식이 올바르지 않습니다")
    private String businessNumber;

    @NotBlank(message = "대표자명은 필수입니다")
    @Size(max = 100, message = "대표자명은 100자를 초과할 수 없습니다")
    private String ceoName;

    @NotBlank(message = "회사명은 필수입니다")
    @Size(max = 255, message = "회사명은 255자를 초과할 수 없습니다")
    private String companyName;

    @NotBlank(message = "주소는 필수입니다")
    private String address;

    @NotBlank(message = "연락처는 필수입니다")
    @Pattern(regexp = "\\d{2,3}-\\d{3,4}-\\d{4}", message = "전화번호 형식이 올바르지 않습니다")
    private String contactPhone;

    @Size(max = 100, message = "업태는 100자를 초과할 수 없습니다")
    private String businessType;

    @Size(max = 100, message = "업종은 100자를 초과할 수 없습니다")
    private String businessItem;

    @Size(max = 100, message = "은행명은 100자를 초과할 수 없습니다")
    private String bankName;

    @Pattern(regexp = "\\d{10,20}", message = "계좌번호는 10-20자리 숫자여야 합니다")
    private String accountNumber;

    @Size(max = 100, message = "예금주는 100자를 초과할 수 없습니다")
    private String accountHolder;
}