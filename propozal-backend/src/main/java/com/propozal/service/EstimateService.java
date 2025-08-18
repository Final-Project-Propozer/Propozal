package com.propozal.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.propozal.dto.estimate.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.propozal.domain.Company;
import com.propozal.domain.EmployeeProfile;
import com.propozal.domain.Estimate;
import com.propozal.domain.EstimateConfirmationToken;
import com.propozal.domain.EstimateItem;
import com.propozal.domain.EstimateVersion;
import com.propozal.domain.Product;
import com.propozal.domain.User;
import com.propozal.dto.detail.EstimateDetailDto;
import com.propozal.dto.email.EstimateSendRequest;
import com.propozal.repository.CompanyRepository;
import com.propozal.repository.EmployeeProfileRepository;
import com.propozal.repository.EstimateConfirmationTokenRepository;
import com.propozal.repository.EstimateItemRepository;
import com.propozal.repository.EstimateRepository;
import com.propozal.repository.EstimateVersionRepository;
import com.propozal.repository.ProductRepository;
import com.propozal.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstimateService {

        @Value("${app.base-url}")
        private String appBaseUrl;

        private final EstimateRepository estimateRepository;
        private final EstimateVersionRepository versionRepository;
        private final ObjectMapper objectMapper;
        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final EstimateItemRepository estimateItemRepository;
        private final EmailService emailService;
        private final EmployeeProfileRepository employeeProfileRepository;
        private final CompanyRepository companyRepository;
        private final EstimateConfirmationTokenRepository tokenRepository;

        @Transactional
        public Estimate createDraftEstimate(User user) {

                LocalDate expiration = LocalDate.now().plusMonths(6);

                Estimate newEstimate = Estimate.builder()
                                .user(user)
                                .customerName("")
                                .totalAmount(BigDecimal.ZERO)
                                .dealStatus(1)
                                .vatIncluded(true)
                                .expirationDate(expiration)
                                .estimateItems(new java.util.ArrayList<>())
                                .build();

                return estimateRepository.save(newEstimate);
        }

        @Transactional
        public Estimate addItemToEstimate(Long estimateId, EstimateItemAddRequest request) {
                Estimate estimate = estimateRepository.findById(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));

                Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "해당 상품을 찾을 수 없습니다. ID: " + request.getProductId()));

                BigDecimal unitPrice = product.getBasePrice();
                BigDecimal discountRate = request.getDiscountRate();

                if (discountRate.compareTo(product.getMaxDiscountRate()) > 0) {
                        throw new IllegalArgumentException("최대 허용 할인율을 초과했습니다.");
                }

                // 공급가액 = 단가 * 수량
                BigDecimal supplyPrice = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));
                // 할인액 = 공급가액 * 할인율
                BigDecimal discountAmount = supplyPrice.multiply(discountRate);
                // 소계 (할인 적용 후) = 공급가액 - 할인액
                BigDecimal subtotal = supplyPrice.subtract(discountAmount);

                // 부가세 계산 (상품이 과세 대상이고, 견적서가 VAT 포함일 경우)
                BigDecimal vatAmount = BigDecimal.ZERO;
                // estimate.isVatIncluded() 와 같은 필드가 Estimate Entity에 있다고 가정
                if (product.isVatApplicable() /* && estimate.isVatIncluded() */) {
                        vatAmount = subtotal.multiply(new BigDecimal("0.1")).setScale(0, RoundingMode.DOWN);
                }

                EstimateItem newItem = EstimateItem.builder()
                                .product(product)
                                .quantity(request.getQuantity())
                                .unitPrice(unitPrice)
                                .discountRate(discountRate)
                                .vatAmount(vatAmount)
                                .subtotal(subtotal)
                                .build();

                estimate.addItem(newItem);

                return estimateRepository.save(estimate);
        }

        @Transactional
        public Estimate updateEstimateItem(Long estimateId, Long itemId, EstimateItemUpdateRequest request) {
                Estimate estimate = estimateRepository.findById(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));

                EstimateItem item = estimateItemRepository.findById(itemId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 품목을 찾을 수 없습니다. ID: " + itemId));

                if (!item.getEstimate().getId().equals(estimate.getId())) {
                        throw new IllegalArgumentException("해당 견적서에 속한 품목이 아닙니다.");
                }
                item.update(request.getQuantity(), request.getDiscountRate());

                estimate.recalculateTotalAmount();

                return estimateRepository.save(estimate);
        }

        @Transactional
        public Estimate updateCustomerInfo(Long estimateId, EstimateCustomerUpdateRequest request) {
                Estimate estimate = estimateRepository.findById(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));

                estimate.updateCustomerInfo(
                                request.getCustomerName(),
                                request.getCustomerEmail(),
                                request.getCustomerPhone(),
                                request.getCustomerCompanyName(),
                                request.getCustomerPosition(),
                                request.getSpecialTerms());

                return estimateRepository.save(estimate);
        }

        @Transactional
        public Estimate deleteEstimateItem(Long estimateId, Long itemId) {
                Estimate estimate = estimateRepository.findById(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));

                EstimateItem item = estimateItemRepository.findById(itemId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 품목을 찾을 수 없습니다. ID: " + itemId));

                if (!item.getEstimate().getId().equals(estimate.getId())) {
                        throw new IllegalArgumentException("해당 견적서에 속한 품목이 아닙니다.");
                }

                estimate.removeItem(item);

                return estimateRepository.save(estimate);
        }

//        @Transactional
//        public void sendEstimateByEmail(Long estimateId, EstimateSendRequest request) {
//                Estimate estimate = this.findEstimateById(estimateId);
//
//                EmployeeProfile senderProfile = employeeProfileRepository.findByUserId(estimate.getUser().getId())
//                                .orElseThrow(() -> new EntityNotFoundException("발신자의 프로필 정보를 찾을 수 없습니다."));
//
//                Company company = companyRepository.findById(senderProfile.getCompany().getId())
//                                .orElseThrow(() -> new EntityNotFoundException("발신자의 회사 정보를 찾을 수 없습니다."));
//
//                String recipientEmail = (request != null && request.getRecipientEmail() != null)
//                                ? request.getRecipientEmail()
//                                : estimate.getCustomerEmail();
//
//                if (recipientEmail == null || recipientEmail.isBlank()) {
//                        throw new IllegalArgumentException("수신자 이메일 주소가 없습니다.");
//                }
//
//                String approveToken = createConfirmationToken(estimate, EstimateConfirmationToken.ActionType.ACCEPT);
//                String rejectToken = createConfirmationToken(estimate, EstimateConfirmationToken.ActionType.REJECT);
//
//                String approveUrl = appBaseUrl + "/estimate/response?token=" + approveToken;
//                String rejectUrl = appBaseUrl + "/estimate/response?token=" + rejectToken;
//
//                Map<String, Object> templateModel = new HashMap<>();
//                templateModel.put("estimate", estimate);
//                templateModel.put("sender", senderProfile);
//                templateModel.put("company", company);
//
//                Map<String, Object> totalAmountInfo = new HashMap<>();
//                totalAmountInfo.put("totalAmount", estimate.getTotalAmount());
//                totalAmountInfo.put("supplyAmount", estimate.getTotalAmount());
//                totalAmountInfo.put("discountAmount", BigDecimal.ZERO);
//                totalAmountInfo.put("vatAmount", BigDecimal.ZERO);
//                templateModel.put("totalAmountInfo", totalAmountInfo);
//
//                templateModel.put("approveUrl", approveUrl);
//                templateModel.put("rejectUrl", rejectUrl);
//
//                String subject = "[PropoZal] " + estimate.getCustomerCompanyName() + " 님께서 요청하신 견적서입니다.";
//
//                emailService.sendEstimateEmail(recipientEmail, subject, templateModel);
//        }

        @Transactional
        public void sendEstimateByEmail(Long estimateId, EstimateSendRequest request) {
                Estimate estimate = this.findEstimateById(estimateId);

                // ✅ 송부일 설정
                estimate.setSentDate(LocalDate.now());

                EmployeeProfile senderProfile = employeeProfileRepository.findByUserId(estimate.getUser().getId())
                        .orElseThrow(() -> new EntityNotFoundException("발신자의 프로필 정보를 찾을 수 없습니다."));

                Company company = companyRepository.findById(senderProfile.getCompany().getId())
                        .orElseThrow(() -> new EntityNotFoundException("발신자의 회사 정보를 찾을 수 없습니다."));

                String recipientEmail = (request != null && request.getRecipientEmail() != null)
                        ? request.getRecipientEmail()
                        : estimate.getCustomerEmail();

                if (recipientEmail == null || recipientEmail.isBlank()) {
                        throw new IllegalArgumentException("수신자 이메일 주소가 없습니다.");
                }

                String approveToken = createConfirmationToken(estimate, EstimateConfirmationToken.ActionType.ACCEPT);
                String rejectToken = createConfirmationToken(estimate, EstimateConfirmationToken.ActionType.REJECT);

                String approveUrl = appBaseUrl + "/estimate/response?token=" + approveToken;
                String rejectUrl = appBaseUrl + "/estimate/response?token=" + rejectToken;

                Map<String, Object> templateModel = new HashMap<>();
                templateModel.put("estimate", estimate);
                templateModel.put("sender", senderProfile);
                templateModel.put("company", company);

                Map<String, Object> totalAmountInfo = new HashMap<>();
                totalAmountInfo.put("totalAmount", estimate.getTotalAmount());
                totalAmountInfo.put("supplyAmount", estimate.getTotalAmount());
                totalAmountInfo.put("discountAmount", BigDecimal.ZERO);
                totalAmountInfo.put("vatAmount", BigDecimal.ZERO);
                templateModel.put("totalAmountInfo", totalAmountInfo);

                templateModel.put("approveUrl", approveUrl);
                templateModel.put("rejectUrl", rejectUrl);

                String subject = "[PropoZal] " + estimate.getCustomerCompanyName() + " 님께서 요청하신 견적서입니다.";

                emailService.sendEstimateEmail(recipientEmail, subject, templateModel);

                // ✅ 저장
                estimateRepository.save(estimate);
        }

        @Transactional(readOnly = true)
        public Estimate findEstimateById(Long estimateId) {
                return estimateRepository.findById(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));
        }

        private String createConfirmationToken(Estimate estimate, EstimateConfirmationToken.ActionType actionType) {
                String tokenValue = UUID.randomUUID().toString();
                EstimateConfirmationToken token = EstimateConfirmationToken.builder()
                                .estimate(estimate)
                                .actionType(actionType)
                                .token(tokenValue)
                                .expiresAt(LocalDateTime.now().plusDays(7)) // 토큰 유효기간 7일
                                .build();
                tokenRepository.save(token);
                return tokenValue;
        }

        @Transactional
        public String processEstimateResponse(String tokenValue) {
                EstimateConfirmationToken token = tokenRepository.findByToken(tokenValue)
                                .orElseThrow(() -> new EntityNotFoundException("유효하지 않은 토큰입니다."));

                if (token.isUsed()) {
                        return "이미 처리된 요청입니다.";
                }
                if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
                        return "만료된 요청입니다.";
                }

                Estimate estimate = token.getEstimate();
                if (token.getActionType() == EstimateConfirmationToken.ActionType.ACCEPT) {
                        estimate.setDealStatus(2); // 2: 거래 성사
                } else {
                        estimate.setDealStatus(0); // 0: 거래 취소
                }
                token.useToken();

                // 변경 감지로 인해 save 호출은 선택사항이지만, 명시적으로 호출
                estimateRepository.save(estimate);
                tokenRepository.save(token);

                return (token.getActionType() == EstimateConfirmationToken.ActionType.ACCEPT)
                                ? "견적서가 성공적으로 승인되었습니다."
                                : "견적서가 거절되었습니다. 소중한 의견 감사합니다.";
        }

//        @Transactional
//        public void saveVersion(Long estimateId, Long userId, String memo) {
//                Estimate estimate = estimateRepository.findById(estimateId)
//                                .orElseThrow(() -> new EntityNotFoundException("견적서를 찾을 수 없습니다."));
//                User user = userRepository.findById(userId)
//                                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
//
//                try {
//                        EstimateDetailDto detailDto = new EstimateDetailDto(estimate);
//                        String estimateJson = objectMapper.writeValueAsString(detailDto);
//
//                        EstimateVersion version = EstimateVersion.builder()
//                                        .estimate(estimate)
//                                        .estimateData(estimateJson)
//                                        .savedBy(user.getName())
//                                        .memo(memo)
//                                        .build();
//
//                        versionRepository.save(version);
//
//                } catch (Exception e) {
//                        throw new RuntimeException("견적서 버전 저장에 실패했습니다.", e);
//                }
//        }

        @Transactional
        public void saveVersion(Long estimateId, Long userId, String memo, EstimateDataDto estimateData) {
                Estimate estimate = estimateRepository.findById(estimateId)
                        .orElseThrow(() -> new EntityNotFoundException("견적서를 찾을 수 없습니다."));
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

                // ✅ 특약사항 등 고객 정보 업데이트
                estimate.updateCustomerInfo(
                        estimateData.getCustomerName(),
                        estimateData.getCustomerEmail(),
                        estimateData.getCustomerPhone(),
                        estimateData.getCustomerCompanyName(),
                        estimateData.getCustomerPosition(),
                        estimateData.getSpecialTerms()
                );

                try {
                        EstimateDetailDto detailDto = new EstimateDetailDto(estimate);
                        String estimateJson = objectMapper.writeValueAsString(detailDto);

                        EstimateVersion version = EstimateVersion.builder()
                                .estimate(estimate)
                                .estimateData(estimateJson)
                                .savedBy(user.getName())
                                .memo(memo)
                                .build();

                        versionRepository.save(version);

                } catch (Exception e) {
                        throw new RuntimeException("견적서 버전 저장에 실패했습니다.", e);
                }
        }

        @Transactional(readOnly = true)
        public List<EstimateVersionResponse> getEstimateVersions(Long estimateId) {
                return versionRepository.findByEstimateIdOrderBySavedAtDesc(estimateId)
                                .stream()
                                .map(EstimateVersionResponse::new)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<EstimateSimpleResponse> getDraftEstimates(Long userId) {
                // dealStatus가 1인 (작성 중) 견적서만 조회
                return estimateRepository.findByUserIdAndDealStatusOrderByUpdatedAtDesc(userId, 1)
                                .stream()
                                .map(EstimateSimpleResponse::new)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<EstimateSimpleResponse> getCompletedEstimates(Long userId) {
                // dealStatus가 1이 아닌 (발송, 승인, 거절 등) 모든 견적서를 조회
                return estimateRepository.findByUserIdAndDealStatusNotOrderByUpdatedAtDesc(userId, 1)
                                .stream()
                                .map(EstimateSimpleResponse::new)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public String loadVersionData(Long versionId) {
                EstimateVersion version = versionRepository.findById(versionId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 버전을 찾을 수 없습니다. ID: " + versionId));

                return version.getEstimateData();
        }
}