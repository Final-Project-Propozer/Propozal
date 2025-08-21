package com.propozal.controller;

import com.propozal.dto.customer.CustomerCreateRequestDto;
import com.propozal.dto.customer.CustomerDetailResponseDto;
import com.propozal.dto.customer.CustomerListResponseDto;
import com.propozal.service.CustomerService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // 고객 조회 (목록)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CustomerListResponseDto>> getCustomers() {
        return ResponseEntity.ok(customerService.getCustomers());
    }

    // 고객 조회 (상세)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerDetailResponseDto> getCustomer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(customerService.getCustomer(id));
    }

    // 고객 등록
    @PostMapping("/insert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerDetailResponseDto> createCustomer(@RequestBody CustomerCreateRequestDto request) {
        return ResponseEntity.ok(customerService.createCustomer(request));
    }

    // 고객 삭제
    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("id") Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
