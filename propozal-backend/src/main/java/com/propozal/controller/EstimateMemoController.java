package com.propozal.controller;

import com.propozal.dto.estimate.EstimateMemoRequest;
import com.propozal.dto.estimate.EstimateMemoResponse;
import com.propozal.jwt.CustomUserDetails;
import com.propozal.service.EstimateMemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estimates/{estimateId}/memos")
@RequiredArgsConstructor
public class EstimateMemoController {

    private final EstimateMemoService estimateMemoService;

    @PostMapping
    public ResponseEntity<Void> createMemo(
            @PathVariable Long estimateId,
            @RequestBody EstimateMemoRequest requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        estimateMemoService.createMemo(estimateId, userDetails.getUser().getId(), requestDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<EstimateMemoResponse>> getMemos(@PathVariable Long estimateId) {
        return ResponseEntity.ok(estimateMemoService.getMemosByEstimate(estimateId));
    }

    @PutMapping("/{memoId}")
    public ResponseEntity<Void> updateMemo(
            @PathVariable Long memoId,
            @RequestBody EstimateMemoRequest requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        estimateMemoService.updateMemo(memoId, userDetails.getUser().getId(), requestDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{memoId}")
    public ResponseEntity<Void> deleteMemo(
            @PathVariable Long memoId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        estimateMemoService.deleteMemo(memoId, userDetails.getUser().getId());
        return ResponseEntity.ok().build();
    }
}