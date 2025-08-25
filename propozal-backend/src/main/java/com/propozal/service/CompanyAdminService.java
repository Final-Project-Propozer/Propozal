package com.propozal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.propozal.domain.Company;
import com.propozal.dto.admin.*;
import com.propozal.repository.CompanyAdminRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyAdminService {

    private final CompanyAdminRepository companyRepository;

    // 회사 등록
    public CompanyDto registerCompany(CompanyRegisterRequestDto requestDto) {
        // 사업자등록번호 중복 확인
        if (companyRepository.existsByBusinessNumber(requestDto.getBusinessNumber())) {
            throw new IllegalArgumentException("이미 등록된 사업자등록번호입니다");
        }

        Company company = Company.builder()
                .adminUserId(requestDto.getAdminUserId())
                .businessNumber(requestDto.getBusinessNumber())
                .ceoName(requestDto.getCeoName())
                .companyName(requestDto.getCompanyName())
                .address(requestDto.getAddress())
                .contactPhone(requestDto.getContactPhone())
                .businessType(requestDto.getBusinessType())
                .businessItem(requestDto.getBusinessItem())
                .bankName(requestDto.getBankName())
                .accountNumber(requestDto.getAccountNumber())
                .accountHolder(requestDto.getAccountHolder())
                .build();

        Company savedCompany = companyRepository.save(company);
        return convertToDto(savedCompany);
    }

    // 회사 조회 (단일)
    @Transactional(readOnly = true)
    public CompanyDto getCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 회사를 찾을 수 없습니다"));
        return convertToDto(company);
    }

    // 회사 다중 조회 (검색)
    @Transactional(readOnly = true)
    public Page<CompanyDto> searchCompanies(CompanySearchDto searchDto) {
        Page<Company> companies = companyRepository.searchCompanies(
                searchDto.getCompanyName(),
                searchDto.getBusinessNumber(),
                searchDto.getCeoName(),
                searchDto.getAddress(),
                searchDto.getPageable()
        );
        return companies.map(this::convertToDto);
    }

    // 회사 수정
    public CompanyDto updateCompany(Long id, CompanyUpdateRequestDto requestDto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 회사를 찾을 수 없습니다"));

        // 사업자등록번호 중복 확인 (자신 제외)
        if (companyRepository.existsByBusinessNumberAndIdNot(requestDto.getBusinessNumber(), id)) {
            throw new IllegalArgumentException("이미 등록된 사업자등록번호입니다");
        }

        company.setBusinessNumber(requestDto.getBusinessNumber());
        company.setCeoName(requestDto.getCeoName());
        company.setCompanyName(requestDto.getCompanyName());
        company.setAddress(requestDto.getAddress());
        company.setContactPhone(requestDto.getContactPhone());
        company.setBusinessType(requestDto.getBusinessType());
        company.setBusinessItem(requestDto.getBusinessItem());
        company.setBankName(requestDto.getBankName());
        company.setAccountNumber(requestDto.getAccountNumber());
        company.setAccountHolder(requestDto.getAccountHolder());

        Company updatedCompany = companyRepository.save(company);
        return convertToDto(updatedCompany);
    }

    // 회사 삭제
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 회사를 찾을 수 없습니다");
        }
        companyRepository.deleteById(id);
    }

    private CompanyDto convertToDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .adminUserId(company.getAdminUserId()) // 체크 해야 함.
                .businessNumber(company.getBusinessNumber())
                .ceoName(company.getCeoName())
                .companyName(company.getCompanyName())
                .address(company.getAddress())
                .contactPhone(company.getContactPhone())
                .businessType(company.getBusinessType())
                .businessItem(company.getBusinessItem())
                .bankName(company.getBankName())
                .accountNumber(company.getAccountNumber())
                .accountHolder(company.getAccountHolder())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}