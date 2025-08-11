package com.propozal.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserDetailResponseDto {
    private Long userId;
    private String email;
    private String name;
    private String department;
    private String position;
    private String phoneNumber;
    private String employeeImageUrl;
}
