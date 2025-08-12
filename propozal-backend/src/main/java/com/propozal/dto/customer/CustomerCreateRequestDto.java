package com.propozal.dto.customer;

import com.propozal.domain.Customer.CustomerType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomerCreateRequestDto {
    private CustomerType customerType; // "COMPANY" | "INDIVIDUAL"
    private String name;
    private String phone;
    private String email;

    // COMPANY 전용 필드 (INDIVIDUAL일 때는 null 가능)
    private String ceoName;
    private String businessAddress;
    private String industry;
    private String businessType;
    private String businessRegistrationNumber;
}
