package com.propozal.dto.approval;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PendingApprovalUserDto {
    private Long userId;
    private String name;
    private String department;
    private String position;
}
