package com.propozal.backend.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.propozal.backend.domain.Estimate;
import com.propozal.backend.dto.estimate.EstimateDetailResponse;
import com.propozal.backend.dto.estimate.EstimateDraftResponse;
import com.propozal.backend.dto.estimate.EstimateItemAddRequest;
import com.propozal.backend.dto.estimate.EstimateItemUpdateRequest;
import com.propozal.backend.service.EstimateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/estimate") 
@RequiredArgsConstructor
public class EstimateController {

    private final EstimateService estimateService;

    /**
     * 빈 견적서를 생성하는 API
     */
    @PostMapping
    public ResponseEntity<EstimateDraftResponse> createDraftEstimate() {
        Estimate createdEstimate = estimateService.createDraftEstimate();
        EstimateDraftResponse response = EstimateDraftResponse.from(createdEstimate);

        // [수정] Location 헤더 경로도 단수형으로 수정
        return ResponseEntity.created(URI.create("/api/estimate/" + response.getId()))
                .body(response);
    }

    /**
     * 기존 견적서에 품목을 추가하는 API
     */
    @PostMapping("/{estimateId}/items")
    public ResponseEntity<EstimateDetailResponse> addItemToEstimate(
            @PathVariable Long estimateId,
            @Valid @RequestBody EstimateItemAddRequest request) {

        Estimate updatedEstimate = estimateService.addItemToEstimate(estimateId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    @PutMapping("/{estimateId}/items/{itemId}")
    public ResponseEntity<EstimateDetailResponse> updateEstimateItem(
            @PathVariable Long estimateId,
            @PathVariable Long itemId,
            @Valid @RequestBody EstimateItemUpdateRequest request) {
        Estimate updatedEstimate = estimateService.updateEstimateItem(estimateId, itemId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }
}