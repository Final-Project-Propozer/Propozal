package com.propozal.dto.admin;

import com.propozal.domain.ActivityActionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityLogResponse {
    private Long id;
    private Long userId;
    private String username;
    private String userRole;
    private ActivityActionType actionType;
    private String ipAddress;
    private String userAgent;
    private String resourceType;
    private String resourceId;
    private String message; // 마스킹된 메시지
    private LocalDateTime createdAt;
}
