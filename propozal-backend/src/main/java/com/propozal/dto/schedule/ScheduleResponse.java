package com.propozal.dto.schedule;

import com.propozal.domain.Schedule;
import com.propozal.domain.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ScheduleResponse {
    private Long id;
    private Long userId;
    private ScheduleType scheduleType;
    private String title;
    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ScheduleResponse from(Schedule s) {
        return ScheduleResponse.builder()
                .id(s.getId())
                .userId(s.getUserId())
                .scheduleType(s.getScheduleType())
                .title(s.getTitle())
                .description(s.getDescription())
                .startDatetime(s.getStartDatetime())
                .endDatetime(s.getEndDatetime())
                .createdAt(s.getCreatedAt() != null ? s.getCreatedAt().toLocalDateTime() : null)
                .updatedAt(s.getUpdatedAt() != null ? s.getUpdatedAt().toLocalDateTime() : null)
                .build();
    }
}
