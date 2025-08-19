package com.propozal.dto.admin;

import com.propozal.domain.ActivityActionType;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class ActivityLogFilterRequest {
    private Long userId;
    private String username;
    private ActivityActionType actionType;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime from;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime to;

    private String resourceType;
    private String resourceId;

    private int page = 0;
    private int size = 20;
    private String sort = "createdAt,desc";
}
