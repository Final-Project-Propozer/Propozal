package com.propozal.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserListResponseDto {
    private Long userId;
    private String name;
    private String department;
    private String position;
}
