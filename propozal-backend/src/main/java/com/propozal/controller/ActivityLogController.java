package com.propozal.controller;

import com.propozal.dto.admin.ActivityLogFilterRequest;
import com.propozal.dto.admin.ActivityLogRequest;
import com.propozal.dto.admin.ActivityLogResponse;
import com.propozal.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @PostMapping
    public ActivityLogResponse record(@RequestBody ActivityLogRequest request) {
        return activityLogService.record(request);
    }

    @GetMapping
    public Page<ActivityLogResponse> list(ActivityLogFilterRequest filter) {
        return activityLogService.search(filter);
    }

    @GetMapping(value = "/export.csv")
    public ResponseEntity<InputStreamResource> exportCsv(ActivityLogFilterRequest filter) {
        ByteArrayInputStream in = activityLogService.exportCsv(filter);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=activity-logs.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(new InputStreamResource(in));
    }

    @GetMapping(value = "/export.pdf")
    public ResponseEntity<InputStreamResource> exportPdf(ActivityLogFilterRequest filter) {
        ByteArrayInputStream in = activityLogService.exportPdf(filter);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=activity-logs.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
