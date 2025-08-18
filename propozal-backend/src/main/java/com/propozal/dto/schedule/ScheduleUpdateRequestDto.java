package com.propozal.dto.schedule;

import com.propozal.domain.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleUpdateRequestDto {

    private ScheduleType scheduleType;
    private String title;
    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private Long userId;
    private String customer;
    private Boolean notify;
}

