package com.propozal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.propozal.dto.user.UserDetailResponseDto;
import com.propozal.dto.user.UserListResponseDto;
import com.propozal.dto.user.UserUpdateRequestDto;
import com.propozal.service.UserManageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserManageController {

    private final UserManageService userManageService;

    // 전체 회원 조회
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserListResponseDto>> getUsers(@RequestParam Long companyId) {
        return ResponseEntity.ok(userManageService.getUsersByCompany(companyId));
    }

    // 회원 정보 상세 조회
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDetailResponseDto> getUserDetail(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userManageService.getUserDetail(userId));
    }

    // 회원 정보 수정
    @PatchMapping("/{userId}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUser(@PathVariable("userId") Long userId,
                                           @RequestBody UserUpdateRequestDto request) {
        userManageService.updateUser(userId, request);
        return ResponseEntity.ok().build();
    }

    // 회원 비활성화
    @PatchMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateUser(@PathVariable("userId") Long userId) {
        userManageService.deactivateUser(userId);
        return ResponseEntity.ok().build();
    }
}
