package com.propozal.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Getter
@Setter
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name="schedule_type", nullable=false)
    private ScheduleType scheduleType; // MEETING, CALL, VISIT

    @Column(nullable=false, length=255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name="start_datetime", nullable=false)
    private LocalDateTime startDatetime;

    @Column(name="end_datetime", nullable=false)
    private LocalDateTime endDatetime;

    @Column(name="created_at", insertable=false, updatable=false)
    private Timestamp createdAt;

    @Column(name="updated_at", insertable=false, updatable=false)
    private Timestamp updatedAt;
}
