package com.propozal.service;

import com.itextpdf.text.*;
import com.propozal.domain.ActivityLog;
import com.propozal.domain.User;
import com.propozal.dto.admin.ActivityLogFilterRequest;
import com.propozal.dto.admin.ActivityLogRequest;
import com.propozal.dto.admin.ActivityLogResponse;
import com.propozal.repository.ActivityLogRepository;
import com.propozal.repository.UserRepository;
import com.propozal.repository.ActivityLogSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

import com.opencsv.CSVWriter;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfWriter;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Value("${activity-log.date-format:yyyy/MM/dd HH:mm:ss}")
    private String dateFormat;

    @Value("${activity-log.csv.header:id,createdAt,username,actionType,message}")
    private String csvHeader;

    @Value("${activity-log.export.text-pattern:%s [log] %s}")
    private String textPattern;

    @Value("${activity-log.default-sort:createdAt,desc}")
    private String defaultSort;

    private static final DateTimeFormatter LOG_TS_FORMAT = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
    private static final String[] CSV_HEADERS = {"id", "createdAt", "username", "actionType", "message"};

    @Transactional
    public ActivityLogResponse record(ActivityLogRequest req) {
        User user = null;
        if (req.getUserId() != null) {
            user = userRepository.findById(req.getUserId()).orElse(null);
        }

        String username = req.getUsername();
        String userRole = req.getUserRole();
        if (user != null) {
            if (username == null || username.isBlank()) {
                username = user.getName();
            }
            if (userRole == null || userRole.isBlank()) {
                userRole = user.getRole() != null ? user.getRole().name() : null;
            }
        }

        ActivityLog entity = ActivityLog.builder()
                .user(user)
                .username(username)
                .userRole(userRole)
                .actionType(req.getActionType())
                .ipAddress(req.getIpAddress())
                .userAgent(req.getUserAgent())
                .resourceType(req.getResourceType())
                .resourceId(req.getResourceId())
                .message(req.getMessage())
                .build();
        ActivityLog saved = activityLogRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> search(ActivityLogFilterRequest f) {
        Sort sort = buildSort(f.getSort());
        Pageable pageable = PageRequest.of(Math.max(f.getPage(), 0), Math.max(f.getSize(), 1), sort);
        return activityLogRepository.findAll(ActivityLogSpecifications.build(f), pageable)
                .map(this::toResponse);
    }

    private Sort buildSort(String sortParam) {
        String sp = (sortParam == null || sortParam.isBlank()) ? defaultSort : sortParam;
        String[] parts = sp.split(",");
        String prop = parts.length > 0 ? parts[0].trim() : "createdAt";
        String dir = parts.length > 1 ? parts[1].trim() : "desc";
        return "asc".equalsIgnoreCase(dir) ? Sort.by(prop).ascending() : Sort.by(prop).descending();
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportCsv(ActivityLogFilterRequest f) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (OutputStreamWriter osw = new OutputStreamWriter(out, StandardCharsets.UTF_8);
             CSVWriter csv = new CSVWriter(osw)) {
            // Resolve fmt and headers from config, fallback to constants
            DateTimeFormatter fmt = (dateFormat != null && !dateFormat.isBlank())
                    ? DateTimeFormatter.ofPattern(dateFormat)
                    : LOG_TS_FORMAT;
            String[] headers = (csvHeader != null && !csvHeader.isBlank())
                    ? csvHeader.split("\\s*,\\s*")
                    : CSV_HEADERS;

            // Header
            csv.writeNext(headers, false);

            // Rows
            activityLogRepository.findAll(ActivityLogSpecifications.build(f), Sort.by("createdAt").descending())
                    .forEach(log -> {
                        String created = log.getCreatedAt() != null ? log.getCreatedAt().format(fmt) : "";
                        String action = (log.getActionType() != null) ? log.getActionType().name() : "";
                        String msg = maskMessage(log.getMessage());
                        String[] row = new String[] {
                                String.valueOf(log.getId()),
                                created,
                                log.getUsername() == null ? "" : log.getUsername(),
                                action,
                                msg == null ? "" : msg
                        };
                        csv.writeNext(row, false);
                    });
            osw.flush();
        } catch (Exception e) {
            throw new IllegalStateException("CSV export failed", e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportPdf(ActivityLogFilterRequest f) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 14);
            document.add(new Paragraph("Activity Logs", titleFont));
            document.add(new Paragraph("\n"));

            // Resolve fmt and text pattern from config, fallback to defaults
            DateTimeFormatter fmt = (dateFormat != null && !dateFormat.isBlank())
                    ? DateTimeFormatter.ofPattern(dateFormat)
                    : LOG_TS_FORMAT;
            String pattern = (textPattern != null && !textPattern.isBlank())
                    ? textPattern
                    : "%s [log] %s";

            // Body lines
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 10);
            activityLogRepository.findAll(ActivityLogSpecifications.build(f), Sort.by("createdAt").descending())
                    .forEach(log -> {
                        String created = log.getCreatedAt() != null ? log.getCreatedAt().format(fmt) : "";
                        String line = String.format(pattern, created, maskMessage(log.getMessage()));
                        try {
                            document.add(new Paragraph(line, bodyFont));
                        } catch (DocumentException e) {
                            throw new RuntimeException(e);
                        }
                    });
        } catch (Exception e) {
            throw new IllegalStateException("PDF export failed", e);
        } finally {
            document.close();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    private ActivityLogResponse toResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .userId(log.getUser() != null ? log.getUser().getId() : null)
                .username(log.getUsername())
                .userRole(log.getUserRole())
                .actionType(log.getActionType())
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .resourceType(log.getResourceType())
                .resourceId(log.getResourceId())
                .message(maskMessage(log.getMessage()))
                .createdAt(log.getCreatedAt())
                .build();
    }

    private static String maskMessage(String message) {
        return ActivityLogMaskingUtil.mask(message);
    }

    private static String safe(String s) {
        return s == null ? "" : s.replaceAll(",", " ");
    }

    private static String quote(String s) {
        if (s == null) return "";
        String escaped = s.replace("\"", "\"\"");
        return '"' + escaped + '"';
    }
}
