package com.propozal.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.propozal.dto.admin.EstimateAdminDto;
import com.propozal.dto.admin.EstimateAdminSearchDto;
import com.propozal.service.EstimateAdminService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/estimates")
@RequiredArgsConstructor
public class EstimateAdminController {

    private final EstimateAdminService estimateService;

    // 견적서 전체 조회
    @GetMapping("/all")
    public ResponseEntity<Page<EstimateAdminDto>> getAllEstimates(Pageable pageable) {
        Page<EstimateAdminDto> estimates = estimateService.getAllEstimates(pageable);
        return ResponseEntity.ok(estimates);
    }

    // 견적서 검색
    @GetMapping("/search")
    public ResponseEntity<Page<EstimateAdminDto>> searchEstimates(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String customerCompanyName,
            Pageable pageable) {

        EstimateAdminSearchDto searchDto = EstimateAdminSearchDto.builder()
                .startDate(startDate)
                .endDate(endDate)
                .userId(userId)
                .customerName(customerName)
                .customerCompanyName(customerCompanyName)
                .pageable(pageable)
                .build();

        Page<EstimateAdminDto> estimates = estimateService.searchEstimates(searchDto);
        return ResponseEntity.ok(estimates);
    }

    // 견적서 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<EstimateAdminDto> getEstimate(@PathVariable Long id) {
        EstimateAdminDto estimate = estimateService.getEstimate(id);
        return ResponseEntity.ok(estimate);
    }

    // 견적서 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstimate(@PathVariable Long id) {
        estimateService.deleteEstimate(id);
        return ResponseEntity.noContent().build();
    }

    // 견적서 PDF 다운로드
    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> downloadEstimatePdf(@PathVariable Long id) {
        try {
            var pdfStream = estimateService.generateEstimatePdf(id);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=estimate_" + id + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(pdfStream));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}