package com.propozal.dto.estimate;

import com.propozal.domain.Estimate;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class EstimateDraftResponse {
    private final Long id;
    private final Integer status;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static EstimateDraftResponse from(Estimate estimate) {
        return new EstimateDraftResponse(estimate);
    }

    private EstimateDraftResponse(Estimate estimate) {
        this.id = estimate.getId();
        this.status = estimate.getDealStatus();
        this.createdAt = estimate.getCreatedAt();
        this.updatedAt = estimate.getUpdatedAt();
    }
}