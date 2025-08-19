package com.propozal.service;

import com.propozal.domain.Company;
import com.propozal.domain.EmployeeProfile;
import com.propozal.domain.Estimate;
import com.propozal.domain.EstimateItem;
import com.propozal.dto.estimate.AmountSummaryDto;
import com.propozal.repository.CompanyRepository;
import com.propozal.repository.EmployeeProfileRepository;
import com.propozal.repository.EstimateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j // 로깅 추가
public class EstimateDataPreparationService {

    private final EstimateRepository estimateRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> prepareTemplateData(Long estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));

        log.info("=== EstimateDataPreparationService 디버깅 ===");
        log.info("Estimate ID: {}", estimateId);
        log.info("Estimate User ID: {}", estimate.getUser().getId());

        // EmployeeProfile 조회 시도
        try {
            EmployeeProfile senderProfile = employeeProfileRepository.findByUserId(estimate.getUser().getId())
                    .orElseThrow(() -> new EntityNotFoundException("발신자의 프로필 정보를 찾을 수 없습니다."));

            log.info("EmployeeProfile 조회 성공:");
            log.info("  - ID: {}", senderProfile.getId());
            log.info("  - Department: {}", senderProfile.getDepartment());
            log.info("  - Position: {}", senderProfile.getPosition());
            log.info("  - PhoneNumber: {}", senderProfile.getPhoneNumber());
            log.info("  - Company ID: {}",
                    senderProfile.getCompany() != null ? senderProfile.getCompany().getId() : "null");
            log.info("  - User Name: {}", senderProfile.getUser() != null ? senderProfile.getUser().getName() : "null");
            log.info("  - User Email: {}",
                    senderProfile.getUser() != null ? senderProfile.getUser().getEmail() : "null");

            // Company 조회 시도
            Company company = companyRepository.findById(senderProfile.getCompany().getId())
                    .orElseThrow(() -> new EntityNotFoundException("발신자의 회사 정보를 찾을 수 없습니다."));

            log.info("Company 조회 성공:");
            log.info("  - ID: {}", company.getId());
            log.info("  - CompanyName: {}", company.getCompanyName());
            log.info("  - ContactPhone: {}", company.getContactPhone());
            log.info("  - Address: {}", company.getAddress());

            Map<String, Object> dataModel = new HashMap<>();
            dataModel.put("estimate", estimate);
            dataModel.put("sender", senderProfile);
            dataModel.put("company", company);

            // 금액 계산...
            BigDecimal supplyAmount = BigDecimal.ZERO;
            BigDecimal totalDiscountAmount = BigDecimal.ZERO;
            BigDecimal totalVatAmount = BigDecimal.ZERO;

            for (EstimateItem item : estimate.getEstimateItems()) {
                BigDecimal itemSupplyPrice = item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity()));
                BigDecimal itemDiscountAmount = itemSupplyPrice.multiply(item.getDiscountRate());

                supplyAmount = supplyAmount.add(itemSupplyPrice);
                totalDiscountAmount = totalDiscountAmount.add(itemDiscountAmount);
                totalVatAmount = totalVatAmount.add(item.getVatAmount());
            }

            AmountSummaryDto amountSummary = AmountSummaryDto.builder()
                    .supplyAmount(supplyAmount)
                    .discountAmount(totalDiscountAmount)
                    .vatAmount(totalVatAmount)
                    .totalAmount(estimate.getTotalAmount())
                    .build();

            dataModel.put("totalAmountInfo", amountSummary);

            log.info("템플릿 데이터 준비 완료!");
            return dataModel;

        } catch (Exception e) {
            log.error("데이터 준비 중 오류 발생: ", e);
            throw e;
        }
    }
}