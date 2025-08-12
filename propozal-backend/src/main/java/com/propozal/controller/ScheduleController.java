package com.propozal.controller;

import com.propozal.dto.schedule.ScheduleCreateRequest;
import com.propozal.dto.schedule.ScheduleResponse;
import com.propozal.dto.schedule.ScheduleUpdateRequest;
import com.propozal.service.ScheduleService;
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
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService service;

    @PostMapping
    public ResponseEntity<ScheduleResponse> create(
            @Valid @RequestBody ScheduleCreateRequest req,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req, userId));
    }

    @GetMapping
    public Page<ScheduleResponse> list(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 20, sort = "startDatetime", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return service.list(from, to, userId, pageable);
    }

    @GetMapping("/{id}")
    public ScheduleResponse get(@PathVariable("id") Long id) {
        return service.get(id);
    }

    @PatchMapping("/{id}")
    public ScheduleResponse update(
            @PathVariable("id") Long id,
            @RequestBody ScheduleUpdateRequest req,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        return service.update(id, req, userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable("id") Long id,                         // ✅ 이름 명시
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        service.delete(id, userId);
    }
}
