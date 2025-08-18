package com.propozal.dto.estimate;

import com.propozal.domain.EstimateVersion;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class EstimateVersionResponse {
    private final Long versionId;
    private final String memo;
    private final String savedBy;
    private final LocalDateTime savedAt;

    public EstimateVersionResponse(EstimateVersion version) {
        this.versionId = version.getId();
        this.memo = version.getMemo();
        this.savedBy = version.getSavedBy();
        this.savedAt = version.getSavedAt();
    }
}