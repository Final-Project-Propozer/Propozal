package com.propozal.dto.schedule;

import com.propozal.domain.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ScheduleCreateRequestDto {
//
//    private Long userId;
//    private ScheduleType scheduleType;
//    private String title;
//    private String description;
//    private LocalDateTime startDatetime;
//    private LocalDateTime endDatetime;
//}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleCreateRequestDto {

    private Long userId;
    private ScheduleType scheduleType;
    private String title;
    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;

    // ✅ 추가할 필드
    private String customer;
    private Boolean notify;
}
