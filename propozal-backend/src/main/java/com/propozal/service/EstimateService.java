package com.propozal.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.propozal.dto.estimate.*;
import org.hibernate.Hibernate;
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
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
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
        private final S3Service s3Service;
        private final EstimateDataPreparationService dataPreparationService;
        private final PdfService pdfService;

        @Transactional
        public Estimate createDraftEstimate(User user) {
                LocalDate expiration = LocalDate.now().plusMonths(6);
                Estimate newEstimate = Estimate.builder()
                                .user(user)
                                .customerName("")
                                .totalAmount(BigDecimal.ZERO)
                                .dealStatus(1) // 1: 작성 중
                                .vatIncluded(true)
                                .expirationDate(expiration)
                                .estimateItems(new java.util.ArrayList<>())
                                .build();
                return estimateRepository.save(newEstimate);
        }

        @Transactional
        public Estimate addItemToEstimate(Long estimateId, EstimateItemAddRequest request) {
                Estimate estimate = findDraftEstimateById(estimateId);
                Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "해당 상품을 찾을 수 없습니다. ID: " + request.getProductId()));

                BigDecimal unitPrice = product.getBasePrice();
                BigDecimal discountRate = request.getDiscountRate();

                if (discountRate.compareTo(product.getMaxDiscountRate()) > 0) {
                        throw new IllegalArgumentException("최대 허용 할인율을 초과했습니다.");
                }

                BigDecimal supplyPrice = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));
                BigDecimal discountAmount = supplyPrice.multiply(discountRate);
                BigDecimal subtotal = supplyPrice.subtract(discountAmount);

                BigDecimal vatAmount = BigDecimal.ZERO;
                if (product.isVatApplicable()) {
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
                Estimate savedEstimate = estimateRepository.save(estimate);
                Hibernate.initialize(savedEstimate.getUser());
                return savedEstimate;
        }

        @Transactional
        public Estimate updateEstimateItem(Long estimateId, Long itemId, EstimateItemUpdateRequest request) {
                Estimate estimate = findDraftEstimateById(estimateId);
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
                Estimate estimate = findDraftEstimateById(estimateId);
                estimate.updateCustomerInfo(
                                request.getCustomerName(),
                                request.getCustomerEmail(),
                                request.getCustomerPhone(),
                                request.getCustomerCompanyName(),
                                request.getCustomerPosition(),
                                request.getSpecialTerms(),
                                request.getDealStatus(),
                                request.getExpirationDate(),
                                request.getSentDate());
                return estimateRepository.save(estimate);
        }

        @Transactional
        public Estimate deleteEstimateItem(Long estimateId, Long itemId) {
                Estimate estimate = findDraftEstimateById(estimateId);
                EstimateItem item = estimateItemRepository.findById(itemId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 품목을 찾을 수 없습니다. ID: " + itemId));

                if (!item.getEstimate().getId().equals(estimate.getId())) {
                        throw new IllegalArgumentException("해당 견적서에 속한 품목이 아닙니다.");
                }

                estimate.removeItem(item);
                return estimateRepository.save(estimate);
        }

        @Transactional
        public void sendEstimateByEmail(Long versionId, EstimateSendRequest request) {
                EstimateVersion version = versionRepository.findById(versionId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 버전을 찾을 수 없습니다."));

                Estimate estimate = version.getEstimate();

                try {
                        // PDF 생성 및 업로드, URL 생성
                        Map<String, Object> templateModel = dataPreparationService
                                        .prepareTemplateData(estimate.getId());
                        byte[] pdfBytes = pdfService.generateEstimatePdf(templateModel);
                        String s3Key = "estimates/estimate-" + estimate.getId() + "-v" + version.getId() + ".pdf";
                        s3Service.uploadPdf(s3Key, pdfBytes);
                        String downloadUrl = s3Service.generatePresignedUrl(s3Key);

                        // 승인/거절 토큰 및 URL 생성
                        String approveToken = this.createConfirmationToken(estimate,
                                        EstimateConfirmationToken.ActionType.ACCEPT);
                        String rejectToken = this.createConfirmationToken(estimate,
                                        EstimateConfirmationToken.ActionType.REJECT);
                        String approveUrl = appBaseUrl + "/estimate/response?token=" + approveToken;
                        String rejectUrl = appBaseUrl + "/estimate/response?token=" + rejectToken;

                        // 최종적으로 이메일 템플릿에 필요한 모든 데이터 추가
                        templateModel.put("downloadUrl", downloadUrl);
                        templateModel.put("approveUrl", approveUrl);
                        templateModel.put("rejectUrl", rejectUrl);

                        // 수신자 이메일 주소 확인
                        String recipientEmail = (request != null && request.getRecipientEmail() != null)
                                        ? request.getRecipientEmail()
                                        : estimate.getCustomerEmail();
                        if (recipientEmail == null || recipientEmail.isBlank()) {
                                throw new IllegalArgumentException("수신자 이메일 주소가 없습니다.");
                        }

                        // 이메일 발송
                        String subject = "[PropoZal] " + estimate.getCustomerCompanyName() + " 님께서 요청하신 견적서입니다.";
                        emailService.sendEstimateEmail(recipientEmail, subject, templateModel);

                        // 상태 변경 및 저장
                        estimate.setDealStatus(3); // 3: 발송 완료
                        estimate.setSentDate(LocalDate.now()); // 송부일 설정
                        estimateRepository.save(estimate);

                } catch (Exception e) {
                        throw new RuntimeException("이메일 발송 중 오류 발생: " + e.getMessage(), e);
                }
        }

        @Transactional(readOnly = true)
        public Estimate findEstimateById(Long estimateId) {
                return estimateRepository.findByIdWithItems(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));
        }

        private String createConfirmationToken(Estimate estimate, EstimateConfirmationToken.ActionType actionType) {
                String tokenValue = UUID.randomUUID().toString();
                EstimateConfirmationToken token = EstimateConfirmationToken.builder()
                                .estimate(estimate)
                                .actionType(actionType)
                                .token(tokenValue)
                                .expiresAt(LocalDateTime.now().plusDays(7))
                                .build();
                tokenRepository.save(token);
                return tokenValue;
        }

        @Transactional
        public String processEstimateResponse(String tokenValue) {
                EstimateConfirmationToken token = tokenRepository.findByToken(tokenValue)
                                .orElseThrow(() -> new EntityNotFoundException("유효하지 않은 토큰입니다."));

                if (token.isUsed())
                        return "이미 처리된 요청입니다.";
                if (token.getExpiresAt().isBefore(LocalDateTime.now()))
                        return "만료된 요청입니다.";

                Estimate estimate = token.getEstimate();
                if (token.getActionType() == EstimateConfirmationToken.ActionType.ACCEPT) {
                        estimate.setDealStatus(2); // 2: 거래 성사
                } else {
                        estimate.setDealStatus(0); // 0: 거래 취소
                }
                token.useToken();

                estimateRepository.save(estimate);
                tokenRepository.save(token);

                return (token.getActionType() == EstimateConfirmationToken.ActionType.ACCEPT)
                                ? "견적서가 성공적으로 승인되었습니다."
                                : "견적서가 거절되었습니다. 소중한 의견 감사합니다.";
        }

        @Transactional
        public EstimateVersion saveVersion(Long estimateId, Long userId, String memo, EstimateDataDto estimateData) {
                Estimate estimate = estimateRepository.findById(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("견적서를 찾을 수 없습니다. ID: " + estimateId));
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

                try {
                        EstimateDataDto cleanData = createCleanEstimateData(estimateData);
                        String estimateJson = objectMapper.writeValueAsString(cleanData);

                        log.info("저장될 Clean JSON: {}", estimateJson);

                        EstimateVersion version = EstimateVersion.builder()
                                        .estimate(estimate)
                                        .estimateData(estimateJson)
                                        .savedBy(user.getName())
                                        .memo(memo)
                                        .build();

                        return versionRepository.save(version);

                } catch (Exception e) {
                        log.error("견적서 버전 저장 실패. Estimate ID: {}", estimateId, e);
                        throw new RuntimeException("견적서 버전 저장에 실패했습니다.", e);
                }
        }

        private EstimateDataDto createCleanEstimateData(EstimateDataDto original) {
                EstimateDataDto clean = new EstimateDataDto();

                clean.setCustomerName(original.getCustomerName());
                clean.setCustomerEmail(original.getCustomerEmail());
                clean.setCustomerPhone(original.getCustomerPhone());
                clean.setCustomerCompanyName(original.getCustomerCompanyName());
                clean.setCustomerPosition(original.getCustomerPosition());
                clean.setSpecialTerms(original.getSpecialTerms());
                clean.setDealStatus(original.getDealStatus());
                clean.setExpirationDate(original.getExpirationDate());
                clean.setSentDate(original.getSentDate());
                clean.setTotalAmount(original.getTotalAmount());
                clean.setSupplyAmount(original.getSupplyAmount());
                clean.setDiscountAmount(original.getDiscountAmount());
                clean.setVatAmount(original.getVatAmount());

                if (original.getItems() != null) {
                        List<ItemDto> cleanItems = original.getItems().stream()
                                        .map(item -> {
                                                ItemDto cleanItem = new ItemDto();
                                                // ID 필드 제외하고 비즈니스 데이터만 복사
                                                cleanItem.setProductName(item.getProductName());
                                                cleanItem.setProductCode(item.getProductCode());
                                                cleanItem.setQuantity(item.getQuantity());
                                                cleanItem.setUnitPrice(item.getUnitPrice());
                                                cleanItem.setDiscountRate(item.getDiscountRate());
                                                cleanItem.setSubtotal(item.getSubtotal());
                                                // ID는 설정하지 않음 (null로 유지)
                                                return cleanItem;
                                        })
                                        .collect(Collectors.toList());

                        clean.setItems(cleanItems);
                } else {
                        clean.setItems(new ArrayList<>());
                }

                return clean;
        }

        @Transactional
        public void restoreEstimateFromData(Long estimateId, EstimateDataDto versionData) {
                Estimate estimate = estimateRepository.findByIdWithItems(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("견적서를 찾을 수 없습니다. ID: " + estimateId));

                estimate.updateCustomerInfo(
                                versionData.getCustomerName(),
                                versionData.getCustomerEmail(),
                                versionData.getCustomerPhone(),
                                versionData.getCustomerCompanyName(),
                                versionData.getCustomerPosition(),
                                versionData.getSpecialTerms(),
                                versionData.getDealStatus(),
                                versionData.getExpirationDate(),
                                versionData.getSentDate());

                estimate.getEstimateItems().clear();

                if (versionData.getItems() != null) {
                        versionData.getItems().forEach(itemDto -> {
                                Product product = productRepository.findByCode(itemDto.getProductCode())
                                                .orElseThrow(() -> new EntityNotFoundException(
                                                                "복원 중 상품을 찾을 수 없습니다. Code: "
                                                                                + itemDto.getProductCode()));

                                BigDecimal unitPrice = product.getBasePrice();
                                BigDecimal discountRate = BigDecimal.valueOf(itemDto.getDiscountRate());
                                BigDecimal supplyPrice = unitPrice.multiply(BigDecimal.valueOf(itemDto.getQuantity()));
                                BigDecimal discountAmount = supplyPrice.multiply(discountRate);
                                BigDecimal subtotal = supplyPrice.subtract(discountAmount);
                                BigDecimal vatAmount = BigDecimal.ZERO;
                                if (product.isVatApplicable()) {
                                        vatAmount = subtotal.multiply(new BigDecimal("0.1")).setScale(0,
                                                        RoundingMode.DOWN);
                                }

                                EstimateItem newItem = EstimateItem.builder()
                                                .product(product)
                                                .quantity(itemDto.getQuantity())
                                                .unitPrice(unitPrice)
                                                .discountRate(discountRate)
                                                .vatAmount(vatAmount)
                                                .subtotal(subtotal)
                                                .build();

                                estimate.addItem(newItem);
                        });
                }

                estimate.recalculateTotalAmount();
                estimateRepository.save(estimate);
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
                return estimateRepository.findByUserIdAndDealStatusOrderByUpdatedAtDesc(userId, 1)
                                .stream()
                                .map(EstimateSimpleResponse::new)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<EstimateSimpleResponse> getCompletedEstimates(Long userId) {
                return estimateRepository.findByUserIdAndDealStatusNotOrderByUpdatedAtDesc(userId, 1)
                                .stream()
                                .map(EstimateSimpleResponse::new)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public String loadVersionData(Long versionId) {
                EstimateVersion version = versionRepository.findById(versionId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 버전을 찾을 수 없습니다."));

                return version.getEstimateData();
        }

        private Estimate findDraftEstimateById(Long estimateId) {
                Estimate estimate = estimateRepository.findById(estimateId)
                                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));
                if (estimate.getDealStatus() != 1) { // 1: DRAFT
                        throw new IllegalStateException("작성 중인 견적서만 수정/추가/삭제할 수 있습니다.");
                }
                return estimate;
        }

        @Transactional
        public String generateEstimateDownloadUrl(Long estimateId) {
                Map<String, Object> dataModel = dataPreparationService.prepareTemplateData(estimateId);
                byte[] pdfBytes = pdfService.generateEstimatePdf(dataModel);
                Estimate estimate = (Estimate) dataModel.get("estimate");
                String s3Key = "estimates/estimate-" + estimate.getId() + "-" + UUID.randomUUID() + ".pdf";
                s3Service.uploadPdf(s3Key, pdfBytes);
                return s3Service.generatePresignedUrl(s3Key);
        }

        private Map<String, Object> prepareVersionTemplateModel(EstimateVersionData versionData, Estimate estimate) {
                // 현재 회사/발신자 정보는 최신 정보 사용
                EmployeeProfile senderProfile = employeeProfileRepository.findByUserId(estimate.getUser().getId())
                                .orElseThrow(() -> new EntityNotFoundException("발신자의 프로필 정보를 찾을 수 없습니다."));
                Company company = companyRepository.findById(senderProfile.getCompany().getId())
                                .orElseThrow(() -> new EntityNotFoundException("발신자의 회사 정보를 찾을 수 없습니다."));

                // 템플릿용 모델 구성
                Map<String, Object> templateModel = new HashMap<>();
                templateModel.put("estimate", versionData); // 버전 시점의 데이터
                templateModel.put("sender", senderProfile); // 최신 발신자 정보
                templateModel.put("company", company); // 최신 회사 정보

                // 금액 요약 계산 (null 체크 포함)
                List<EstimateVersionData.EstimateItemData> items = versionData.getItems();
                if (items == null || items.isEmpty()) {
                        // items가 null이거나 비어있으면 기본값 설정
                        AmountSummaryDto amountSummary = AmountSummaryDto.builder()
                                        .supplyAmount(BigDecimal.ZERO)
                                        .discountAmount(BigDecimal.ZERO)
                                        .vatAmount(BigDecimal.ZERO)
                                        .totalAmount(versionData.getTotalAmount() != null ? versionData.getTotalAmount()
                                                        : BigDecimal.ZERO)
                                        .build();
                        templateModel.put("totalAmountInfo", amountSummary);

                        // items를 빈 리스트로 설정
                        versionData.setItems(new ArrayList<>());
                } else {
                        // 정상적인 금액 계산
                        BigDecimal supplyAmount = items.stream()
                                        .filter(item -> item.getUnitPrice() != null && item.getQuantity() != null)
                                        .map(item -> item.getUnitPrice()
                                                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        BigDecimal totalDiscountAmount = items.stream()
                                        .filter(item -> item.getUnitPrice() != null && item.getQuantity() != null
                                                        && item.getDiscountRate() != null)
                                        .map(item -> item.getUnitPrice()
                                                        .multiply(BigDecimal.valueOf(item.getQuantity()))
                                                        .multiply(item.getDiscountRate()))
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        BigDecimal totalVatAmount = items.stream()
                                        .filter(item -> item.getVatAmount() != null)
                                        .map(EstimateVersionData.EstimateItemData::getVatAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        AmountSummaryDto amountSummary = AmountSummaryDto.builder()
                                        .supplyAmount(supplyAmount)
                                        .discountAmount(totalDiscountAmount)
                                        .vatAmount(totalVatAmount)
                                        .totalAmount(versionData.getTotalAmount())
                                        .build();

                        templateModel.put("totalAmountInfo", amountSummary);
                }

                return templateModel;
        }
}
