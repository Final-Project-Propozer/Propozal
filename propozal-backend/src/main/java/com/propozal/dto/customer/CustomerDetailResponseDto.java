package com.propozal.dto.customer;

import com.propozal.domain.Customer.CustomerType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CustomerDetailResponseDto {
    private Long id;
    private CustomerType customerType;
    private String name;
    private String phone;
    private String email;

    // COMPANY 전용 필드 (INDIVIDUAL일 때는 null 가능)
    private String ceoName;
    private String businessAddress;
    private String industry;
    private String businessType;
    private String businessRegistrationNumber;

    private LocalDateTime createdAt;
}
