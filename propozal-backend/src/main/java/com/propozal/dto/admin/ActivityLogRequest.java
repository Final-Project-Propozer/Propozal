package com.propozal.dto.admin;

import com.propozal.domain.ActivityActionType;
import lombok.Data;

@Data
public class ActivityLogRequest {
    private Long userId;            // 선택: 시스템 이벤트면 null 가능
    private String username;        // 화면에 빠르게 표현하기 위해 저장 가능
    private String userRole;        // 선택
    private ActivityActionType actionType;
    private String ipAddress;
    private String userAgent;
    private String resourceType;    // ex) ESTIMATE, COMPANY
    private String resourceId;      // ex) 123
    private String message;         // 원문 메시지 (마스킹 전)
}
