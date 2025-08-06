package com.propozal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.propozal.dto.approval.PendingApprovalListResponseDto;
import com.propozal.service.ApprovalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/users/pending")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    // 승인 대기 목록 조회
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PendingApprovalListResponseDto> getPendingApprovals(@RequestParam("companyId") Long companyId) {
        return ResponseEntity.ok(approvalService.getPendingApprovals(companyId));
    }

    // 승인
    @PostMapping("/{userId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveUser(@PathVariable("userId") Long userId) {
        approvalService.approveUser(userId);
        return ResponseEntity.ok().build();
    }

    // 거부
    @PostMapping("/{userId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectUser(@PathVariable("userId") Long userId) {
        approvalService.rejectUser(userId);
        return ResponseEntity.ok().build();
    }
}
