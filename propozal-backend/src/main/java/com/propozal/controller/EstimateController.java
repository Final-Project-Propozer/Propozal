package com.propozal.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
import com.propozal.domain.User;
import com.propozal.dto.email.EstimateSendRequest;
import com.propozal.dto.estimate.EstimateCustomerUpdateRequest;
import com.propozal.dto.estimate.EstimateDetailResponse;
import com.propozal.dto.estimate.EstimateDraftResponse;
import com.propozal.dto.estimate.EstimateItemAddRequest;
import com.propozal.dto.estimate.EstimateItemUpdateRequest;
import com.propozal.dto.estimate.EstimateVersionResponse;
import com.propozal.jwt.CustomUserDetails;
import com.propozal.service.EstimateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/estimate")
@RequiredArgsConstructor
@Slf4j
public class EstimateController {

    private final EstimateService estimateService;

    @PostMapping
    public ResponseEntity<EstimateDraftResponse> createDraftEstimate(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        User loggedInUser = userDetails.getUser();

        Estimate createdEstimate = estimateService.createDraftEstimate(loggedInUser);

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

        try {
            log.debug("이메일 발송 요청 시작 - estimateId: {}, request: {}", estimateId, request);

            estimateService.sendEstimateByEmail(estimateId, request);

            log.debug("이메일 발송 완료 - estimateId: {}", estimateId);

            Map<String, String> response = Map.of("message", "견적서가 성공적으로 전송되었습니다.");
            log.debug("응답 데이터: {}", response);

            ResponseEntity<?> responseEntity = ResponseEntity.ok(response);
            log.debug("ResponseEntity 생성 완료: {}", responseEntity.getStatusCode());

            return responseEntity;

        } catch (Exception e) {
            log.error("이메일 발송 실패 - estimateId: {}, error: {}", estimateId, e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Internal Server Error",
                    "message", "이메일 발송에 실패했습니다.",
                    "timestamp", java.time.LocalDateTime.now().toString(),
                    "status", 500));
        }
    }

    @PostMapping("/{estimateId}/versions")
    public ResponseEntity<?> saveVersion(
            @PathVariable("estimateId") Long estimateId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody(required = false) Map<String, String> payload) { // 메모를 받기 위해 Body 추가

        String memo = (payload != null) ? payload.get("memo") : "임시 저장";
        estimateService.saveVersion(estimateId, userDetails.getUser().getId(), memo);
        return ResponseEntity.ok(Map.of("message", "견적서가 임시 저장되었습니다."));
    }

    @GetMapping("/{estimateId}/versions")
    public ResponseEntity<List<EstimateVersionResponse>> getEstimateVersions(
            @PathVariable("estimateId") Long estimateId) {

        List<EstimateVersionResponse> versions = estimateService.getEstimateVersions(estimateId);
        return ResponseEntity.ok(versions);
    }
}