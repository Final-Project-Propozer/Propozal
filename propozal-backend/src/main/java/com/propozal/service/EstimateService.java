package com.propozal.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.propozal.domain.Estimate;
import com.propozal.domain.EstimateItem;
import com.propozal.domain.Product;
import com.propozal.dto.estimate.EstimateCustomerUpdateRequest;
import com.propozal.dto.estimate.EstimateItemAddRequest;
import com.propozal.dto.estimate.EstimateItemUpdateRequest;
import com.propozal.repository.EstimateItemRepository;
import com.propozal.repository.EstimateRepository;
import com.propozal.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstimateService {

    private final EstimateRepository estimateRepository;
    private final ProductRepository productRepository;
    private final EstimateItemRepository estimateItemRepository;

    /**
     * 빈 초안(Draft) 상태의 견적서를 생성
     * 로그인 기능 구현 전까지는 임시로 userId를 1로 설정
     */
    @Transactional
    public Estimate createDraftEstimate() {
        
        LocalDate expiration = LocalDate.now().plusMonths(6);

        Estimate newEstimate = Estimate.builder()
                .userId(1L) // 임시 사용자 ID
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
                .orElseThrow(() -> new EntityNotFoundException("해당 상품을 찾을 수 없습니다. ID: " + request.getProductId()));
        
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
                request.getSpecialTerms()
        );

        return estimateRepository.save(estimate);
    }
}