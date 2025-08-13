package com.propozal.controller;

import com.propozal.dto.admin.ScheduleCreateAdminRequestDto;
import com.propozal.dto.admin.ScheduleUpdateAdminRequestDto;
import com.propozal.dto.schedule.ScheduleResponseDto;
import com.propozal.service.AdminScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/schedule")
@RequiredArgsConstructor
public class AdminScheduleController {

    private final AdminScheduleService service;

    @PostMapping
    public ResponseEntity<ScheduleResponseDto> createForUser(
            @Valid @RequestBody ScheduleCreateAdminRequestDto req,
            @AuthenticationPrincipal(expression = "user.id") Long adminUserId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createForUser(req, adminUserId));
    }

    @GetMapping
    public Page<ScheduleResponseDto> list(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 20, sort = "startDatetime", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return service.list(from, to, userId, pageable);
    }

    @GetMapping("/upcoming")
    public Page<ScheduleResponseDto> upcoming(
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 20, sort = "startDatetime", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return service.upcoming(userId, pageable);
    }

    @GetMapping("/{id}")
    public ScheduleResponseDto get(@PathVariable("id") Long id) {
        return service.get(id);
    }

    @PatchMapping("/{id}")
    public ScheduleResponseDto update(
            @PathVariable("id") Long id,
            @RequestBody ScheduleUpdateAdminRequestDto req,
            @AuthenticationPrincipal(expression = "user.id") Long adminUserId
    ) {
        return service.update(id, req, adminUserId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal(expression = "user.id") Long adminUserId
    ) {
        service.delete(id, adminUserId);
    }
}
