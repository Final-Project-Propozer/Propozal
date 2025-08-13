package com.propozal.dto.schedule;

import com.propozal.domain.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ScheduleCreateRequestDto {
    private String title;
    private String description;
    private ScheduleType scheduleType;  // MEETING, CALL, VISIT
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
}
