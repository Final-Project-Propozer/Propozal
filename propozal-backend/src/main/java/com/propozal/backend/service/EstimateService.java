package com.propozal.backend.service;

import com.propozal.backend.domain.Estimate;
import com.propozal.backend.domain.EstimateItem;
import com.propozal.backend.dto.estimate.EstimateCreateRequest;
import com.propozal.backend.repository.EstimateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EstimateService {

    private final EstimateRepository estimateRepository;

    @Transactional
    public Estimate createEstimate(EstimateCreateRequest request) {

        List<EstimateItem> estimateItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (EstimateCreateRequest.ItemRequest itemRequest : request.getItems()) {

            BigDecimal unitPrice = itemRequest.getUnitPrice();
            int quantity = itemRequest.getQuantity();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            totalAmount = totalAmount.add(subtotal);

            EstimateItem estimateItem = EstimateItem.builder()
                    .productName(itemRequest.getProductName())
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .subtotal(subtotal)
                    .build();
            estimateItems.add(estimateItem);
        }

        Estimate estimate = Estimate.builder()
                .userId(request.getUserId())
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .customerCompanyName(request.getCustomerCompanyName())
                .customerPosition(request.getCustomerPosition())
                .totalAmount(totalAmount)
                .estimateItems(estimateItems)
                .build();

        return estimateRepository.save(estimate);
    }
}