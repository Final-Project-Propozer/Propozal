package com.propozal.dto.estimate;

import com.propozal.domain.EstimateMemo;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class EstimateMemoResponse {
    private Long id;
    private String content;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public EstimateMemoResponse(EstimateMemo memo) {
        this.id = memo.getId();
        this.content = memo.getContent();
        this.createdByName = memo.getCreatedBy().getName(); // 필요시 DTO에서 꺼냄
        this.createdAt = memo.getCreatedAt();
        this.updatedAt = memo.getUpdatedAt();
    }
}
