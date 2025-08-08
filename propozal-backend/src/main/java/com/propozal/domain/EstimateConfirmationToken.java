package com.propozal.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "estimate_confirmation_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EstimateConfirmationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType actionType;

    @Column(nullable = false, unique = true)
    private String token;

    private boolean isUsed = false;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Builder
    public EstimateConfirmationToken(Estimate estimate, ActionType actionType, String token, LocalDateTime expiresAt) {
        this.estimate = estimate;
        this.actionType = actionType;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    public void useToken() {
        this.isUsed = true;
    }

    public enum ActionType {
        ACCEPT, REJECT
    }
}
