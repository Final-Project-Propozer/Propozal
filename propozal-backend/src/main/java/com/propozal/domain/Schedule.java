package com.propozal.domain;

import com.propozal.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 사용자와의 관계 설정 (user_id: BIGINT)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ENUM 타입 (schedule_type: ENUM, utf8mb4)
    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_type", nullable = false)
    private ScheduleType scheduleType;

    // VARCHAR(255), utf8mb4
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    // TEXT, utf8mb4
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // DATETIME
    @Column(name = "start_datetime", nullable = false)
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime", nullable = false)
    private LocalDateTime endDatetime;

    // 고객 이름
    @Column(name = "customer", length = 100)
    private String customer;

    // 알림 여부
    @Column(name = "notify")
    private Boolean notify;

    // TIMESTAMP
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 자동 시간 설정
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
