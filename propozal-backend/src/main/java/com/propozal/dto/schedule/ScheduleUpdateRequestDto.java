package com.propozal.dto.schedule;

import com.propozal.domain.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ScheduleUpdateRequestDto {
    private String title;
    private String description;
    private ScheduleType scheduleType;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime; // null이면 서버에서 +30분
}

