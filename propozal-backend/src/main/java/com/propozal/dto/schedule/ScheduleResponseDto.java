package com.propozal.dto.schedule;

import com.propozal.domain.Schedule;
import com.propozal.domain.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ScheduleResponseDto {
//
//    private Long id;
//    private Long userId;
//    private ScheduleType scheduleType;
//    private String title;
//    private String description;
//    private LocalDateTime startDatetime;
//    private LocalDateTime endDatetime;
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//
//    public static ScheduleResponseDto fromEntity(Schedule schedule) {
//        return ScheduleResponseDto.builder()
//                .id(schedule.getId())
//                .userId(schedule.getUser().getId())
//                .scheduleType(schedule.getScheduleType())
//                .title(schedule.getTitle())
//                .description(schedule.getDescription())
//                .startDatetime(schedule.getStartDatetime())
//                .endDatetime(schedule.getEndDatetime())
//                .createdAt(schedule.getCreatedAt())
//                .updatedAt(schedule.getUpdatedAt())
//                .build();
//    }
//}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponseDto {

    private Long id;
    private Long userId;
    private ScheduleType scheduleType;
    private String title;
    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private String customer;         // ✅ 추가
    private Boolean notify;          // ✅ 추가
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ScheduleResponseDto fromEntity(Schedule schedule) {
        return ScheduleResponseDto.builder()
                .id(schedule.getId())
                .userId(schedule.getUser().getId())
                .scheduleType(schedule.getScheduleType())
                .title(schedule.getTitle())
                .description(schedule.getDescription())
                .startDatetime(schedule.getStartDatetime())
                .endDatetime(schedule.getEndDatetime())
                .customer(schedule.getCustomer())     // ✅ 추가
                .notify(schedule.getNotify())         // ✅ 추가
                .createdAt(schedule.getCreatedAt())
                .updatedAt(schedule.getUpdatedAt())
                .build();
    }
}
