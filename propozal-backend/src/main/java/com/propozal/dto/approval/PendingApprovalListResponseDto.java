package com.propozal.dto.approval;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PendingApprovalListResponseDto {
    private Long companyId;
    private String companyName;
    private List<PendingApprovalUserDto> pendingEmployees;
}
