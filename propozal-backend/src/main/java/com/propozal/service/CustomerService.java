package com.propozal.service;

import com.propozal.domain.Customer;
import com.propozal.domain.Customer.CustomerType;
import com.propozal.dto.customer.CustomerCreateRequestDto;
import com.propozal.dto.customer.CustomerDetailResponseDto;
import com.propozal.dto.customer.CustomerListResponseDto;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerListResponseDto> getCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toListResponse)
                .toList();
    }

    public CustomerDetailResponseDto getCustomer(Long id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.CUSTOMER_NOT_FOUND));
        return toDetailResponse(c);
    }

    @Transactional
    public CustomerDetailResponseDto createCustomer(CustomerCreateRequestDto req) {
        if (req.getCustomerType() == null) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
        if (req.getName() == null || req.getName().isBlank()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        // COMPANY일 때만 필수로 처리하고 싶다면 아래 체크 추가 (정책에 따라)
        if (req.getCustomerType() == CustomerType.COMPANY) {
            if (req.getCeoName() == null || req.getBusinessAddress() == null) {
                // 필요한 항목 더 묶어서 체크 가능
                throw new CustomException(ErrorCode.INVALID_REQUEST);
            }
        }

        Customer entity = Customer.builder()
                .customerType(req.getCustomerType())
                .name(req.getName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .ceoName(req.getCeoName())
                .businessAddress(req.getBusinessAddress())
                .industry(req.getIndustry())
                .businessType(req.getBusinessType())
                .businessRegistrationNumber(req.getBusinessRegistrationNumber())
                .build();

        Customer saved = customerRepository.save(entity);
        return toDetailResponse(saved);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.CUSTOMER_NOT_FOUND));
        customerRepository.delete(c);
    }

    private CustomerListResponseDto toListResponse(Customer c) {
        return new CustomerListResponseDto(
                c.getId(),
                c.getCustomerType(),
                c.getName(),
                c.getPhone(),
                c.getEmail()
        );
    }

    private CustomerDetailResponseDto toDetailResponse(Customer c) {
        return new CustomerDetailResponseDto(
                c.getId(),
                c.getCustomerType(),
                c.getName(),
                c.getPhone(),
                c.getEmail(),
                c.getCeoName(),
                c.getBusinessAddress(),
                c.getIndustry(),
                c.getBusinessType(),
                c.getBusinessRegistrationNumber(),
                c.getCreatedAt()
        );
    }
}
