package com.propozal.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "activity_logs",
        indexes = {
                @Index(name = "idx_activity_user", columnList = "user_id"),
                @Index(name = "idx_activity_action", columnList = "actionType"),
                @Index(name = "idx_activity_created_at", columnList = "createdAt")
        })
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 100)
    private String username; // 화면 표시 및 검색 성능을 위한 저장

    @Column(length = 100)
    private String userRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityActionType actionType;

    @Column(length = 64)
    private String ipAddress;

    @Column(length = 255)
    private String userAgent;

    @Column(length = 100)
    private String resourceType; // 예: ESTIMATE, COMPANY 등

    @Column(length = 100)
    private String resourceId; // 문자열로 저장(유연성)

    @Lob
    @Column(nullable = false)
    private String message; // 원문 메시지(마스킹은 응답 시 적용)

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
