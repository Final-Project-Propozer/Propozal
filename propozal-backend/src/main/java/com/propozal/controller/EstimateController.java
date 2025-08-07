package com.propozal.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.propozal.domain.Estimate;
import com.propozal.dto.email.EstimateSendRequest;
import com.propozal.dto.estimate.EstimateCustomerUpdateRequest;
import com.propozal.dto.estimate.EstimateDetailResponse;
import com.propozal.dto.estimate.EstimateDraftResponse;
import com.propozal.dto.estimate.EstimateItemAddRequest;
import com.propozal.dto.estimate.EstimateItemUpdateRequest;
import com.propozal.service.EmailService;
import com.propozal.service.EstimateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/estimate")
@RequiredArgsConstructor
public class EstimateController {

    private final EstimateService estimateService;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<EstimateDraftResponse> createDraftEstimate() {
        Estimate createdEstimate = estimateService.createDraftEstimate();
        EstimateDraftResponse response = EstimateDraftResponse.from(createdEstimate);

        return ResponseEntity.created(URI.create("/api/estimate/" + response.getId()))
                .body(response);
    }

    @PostMapping("/{estimateId}/items")
    public ResponseEntity<EstimateDetailResponse> addItemToEstimate(
            @PathVariable("estimateId") Long estimateId,
            @Valid @RequestBody EstimateItemAddRequest request) {

        Estimate updatedEstimate = estimateService.addItemToEstimate(estimateId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    @PutMapping("/{estimateId}/items/{itemId}")
    public ResponseEntity<EstimateDetailResponse> updateEstimateItem(
            @PathVariable("estimateId") Long estimateId,
            @PathVariable("itemId") Long itemId,
            @Valid @RequestBody EstimateItemUpdateRequest request) {
        Estimate updatedEstimate = estimateService.updateEstimateItem(estimateId, itemId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    @PatchMapping("/{estimateId}")
    public ResponseEntity<EstimateDetailResponse> updateCustomerInfo(
            @PathVariable("estimateId") Long estimateId,
            @Valid @RequestBody EstimateCustomerUpdateRequest request) {

        Estimate updatedEstimate = estimateService.updateCustomerInfo(estimateId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    @DeleteMapping("/{estimateId}/items/{itemId}")
    public ResponseEntity<EstimateDetailResponse> deleteEstimateItem(
            @PathVariable("estimateId") Long estimateId,
            @PathVariable("itemId") Long itemId) {

        Estimate updatedEstimate = estimateService.deleteEstimateItem(estimateId, itemId);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    @GetMapping("/{estimateId}")
    public ResponseEntity<EstimateDetailResponse> getEstimate(
            @PathVariable("estimateId") Long estimateId) {

        Estimate estimate = estimateService.findEstimateById(estimateId);
        return ResponseEntity.ok(EstimateDetailResponse.from(estimate));
    }

    @PostMapping("/{estimateId}/sendmail")
    public ResponseEntity<?> sendEstimateByEmail(
            @PathVariable("estimateId") Long estimateId,
            @RequestBody(required = false) @Valid EstimateSendRequest request) {

        estimateService.sendEstimateByEmail(estimateId, request);
        return ResponseEntity.ok(Map.of("message", "견적서가 성공적으로 전송되었습니다."));
    }
}