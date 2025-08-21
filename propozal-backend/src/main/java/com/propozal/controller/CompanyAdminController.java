package com.propozal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.propozal.dto.admin.*;
import com.propozal.service.CompanyAdminService;

@RestController
@RequestMapping("/api/admin/company")
@RequiredArgsConstructor
public class CompanyAdminController {

    private final CompanyAdminService companyService;

    // 회사 등록
    @PostMapping("/register")
    public ResponseEntity<CompanyDto> registerCompany(@Valid @RequestBody CompanyRegisterRequestDto requestDto) {
        CompanyDto companyDto = companyService.registerCompany(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(companyDto);
    }

    // 회사 조회 (단일)
    @GetMapping("/profile/{id}")
    public ResponseEntity<CompanyDto> getCompany(@PathVariable Long id) {
        CompanyDto companyDto = companyService.getCompany(id);
        return ResponseEntity.ok(companyDto);
    }

    // 회사 다중 조회 (검색)
    @GetMapping("/search")
    public ResponseEntity<Page<CompanyDto>> searchCompanies(
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String businessNumber,
            @RequestParam(required = false) String ceoName,
            @RequestParam(required = false) String address,
            Pageable pageable) {

        CompanySearchDto searchDto = CompanySearchDto.builder()
                .companyName(companyName)
                .businessNumber(businessNumber)
                .ceoName(ceoName)
                .address(address)
                .pageable(pageable)
                .build();

        Page<CompanyDto> companies = companyService.searchCompanies(searchDto);
        return ResponseEntity.ok(companies);
    }

    // 회사 수정
    @PatchMapping("/profile/{id}")
    public ResponseEntity<CompanyDto> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyUpdateRequestDto requestDto) {
        CompanyDto companyDto = companyService.updateCompany(id, requestDto);
        return ResponseEntity.ok(companyDto);
    }

    // 회사 삭제
    @DeleteMapping("/profile/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}