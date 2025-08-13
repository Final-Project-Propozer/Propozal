package com.propozal.dto.customer;

import com.propozal.domain.Customer.CustomerType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomerListResponseDto {
    private Long id;
    private CustomerType customerType; // "COMPANY" | "INDIVIDUAL"
    private String name;
    private String phone;
    private String email;
}
