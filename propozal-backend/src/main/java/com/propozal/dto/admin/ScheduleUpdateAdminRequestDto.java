package com.propozal.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import com.propozal.domain.ScheduleType;

@Getter @Setter
public class ScheduleUpdateAdminRequestDto {
    private Long userId;
    private String title;
    private String description;
    private ScheduleType scheduleType;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
}
