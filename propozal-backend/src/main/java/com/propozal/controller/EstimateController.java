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
import com.propozal.dto.estimate.EstimateSimpleResponse;
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

    // 1. 빈 견적서 생성 (견적 번호 할당)
    @PostMapping
    public ResponseEntity<EstimateDraftResponse> createDraftEstimate(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User loggedInUser = userDetails.getUser();
        Estimate createdEstimate = estimateService.createDraftEstimate(loggedInUser);
        EstimateDraftResponse response = EstimateDraftResponse.from(createdEstimate);
        return ResponseEntity.created(URI.create("/api/estimate/" + response.getId()))
                .body(response);
    }

    // 2. 특정 견적서의 상세 정보 조회 (미리보기 및 수정 페이지 로딩용)
    @GetMapping("/{estimateId}")
    public ResponseEntity<EstimateDetailResponse> getEstimate(
            @PathVariable("estimateId") Long estimateId) {
        Estimate estimate = estimateService.findEstimateById(estimateId);
        return ResponseEntity.ok(EstimateDetailResponse.from(estimate));
    }

    // 3. 견적서의 고객 정보 수정
    @PatchMapping("/{estimateId}")
    public ResponseEntity<EstimateDetailResponse> updateCustomerInfo(
            @PathVariable("estimateId") Long estimateId,
            @Valid @RequestBody EstimateCustomerUpdateRequest request) {
        Estimate updatedEstimate = estimateService.updateCustomerInfo(estimateId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    // 4. 기존 견적서에 품목 추가
    @PostMapping("/{estimateId}/items")
    public ResponseEntity<EstimateDetailResponse> addItemToEstimate(
            @PathVariable("estimateId") Long estimateId,
            @Valid @RequestBody EstimateItemAddRequest request) {
        Estimate updatedEstimate = estimateService.addItemToEstimate(estimateId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    // 5. 기존 품목의 수량/할인율 수정
    @PutMapping("/{estimateId}/items/{itemId}")
    public ResponseEntity<EstimateDetailResponse> updateEstimateItem(
            @PathVariable("estimateId") Long estimateId,
            @PathVariable("itemId") Long itemId,
            @Valid @RequestBody EstimateItemUpdateRequest request) {
        Estimate updatedEstimate = estimateService.updateEstimateItem(estimateId, itemId, request);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    // 6. 견적서에서 특정 품목 삭제
    @DeleteMapping("/{estimateId}/items/{itemId}")
    public ResponseEntity<EstimateDetailResponse> deleteEstimateItem(
            @PathVariable("estimateId") Long estimateId,
            @PathVariable("itemId") Long itemId) {
        Estimate updatedEstimate = estimateService.deleteEstimateItem(estimateId, itemId);
        return ResponseEntity.ok(EstimateDetailResponse.from(updatedEstimate));
    }

    // 7. 견적서를 이메일로 발송
    @PostMapping("/versions/{versionId}/send")
    public ResponseEntity<?> sendEstimateByEmail(
            @PathVariable("versionId") Long versionId,
            @RequestBody(required = false) @Valid EstimateSendRequest request) {

        estimateService.sendEstimateByEmail(versionId, request);
        return ResponseEntity.ok(Map.of("message", "견적서가 성공적으로 전송되었습니다."));
    }

    // 8. 현재 견적서 상태를 버전으로 임시 저장
    @PostMapping("/{estimateId}/versions")
    public ResponseEntity<?> saveVersion(
            @PathVariable("estimateId") Long estimateId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody(required = false) Map<String, String> payload) {

        String memo = (payload != null) ? payload.get("memo") : "버전 저장";
        estimateService.saveVersion(estimateId, userDetails.getUser().getId(), memo);
        return ResponseEntity.ok(Map.of("message", "견적서가 저장되었습니다."));
    }

    // 9. 특정 견적서의 모든 버전 목록 조회
    @GetMapping("/{estimateId}/versions")
    public ResponseEntity<List<EstimateVersionResponse>> getEstimateVersions(
            @PathVariable("estimateId") Long estimateId) {
        List<EstimateVersionResponse> versions = estimateService.getEstimateVersions(estimateId);
        return ResponseEntity.ok(versions);
    }

    // 10. 특정 버전의 상세 데이터(JSON)를 불러오기
    @GetMapping("/versions/{versionId}")
    public ResponseEntity<String> getVersionData(@PathVariable("versionId") Long versionId) {
        String versionData = estimateService.loadVersionData(versionId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(versionData);
    }

    // 11. 임시 저장된 견적서 목록 조회
    @GetMapping("/drafts")
    public ResponseEntity<List<EstimateSimpleResponse>> getDraftEstimates(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        List<EstimateSimpleResponse> drafts = estimateService.getDraftEstimates(user.getId());
        return ResponseEntity.ok(drafts);
    }

    // 12. 완성된 (발송/승인/거절) 견적서 목록 조회
    @GetMapping("/completed")
    public ResponseEntity<List<EstimateSimpleResponse>> getCompletedEstimates(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        List<EstimateSimpleResponse> completed = estimateService.getCompletedEstimates(user.getId());
        return ResponseEntity.ok(completed);
    }

    // 13. 견적서 PDF 다운로드 생성
    @GetMapping("/{estimateId}/download-url")
    public ResponseEntity<?> getEstimateDownloadUrl(@PathVariable("estimateId") Long estimateId) {
        String downloadUrl = estimateService.generateEstimateDownloadUrl(estimateId);
        return ResponseEntity.ok(Map.of("downloadUrl", downloadUrl));
    }
}
