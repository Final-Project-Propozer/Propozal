package com.propozal.dto.admin;

import com.propozal.domain.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ScheduleCreateAdminRequestDto {
    private Long userId;
    private String title;
    private String description;
    private ScheduleType scheduleType; // MEETING / CALL / VISIT
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
}
