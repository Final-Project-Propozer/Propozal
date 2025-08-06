package com.propozal.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequestDto {
    private String password;
    private String email;
    private String name;
    private String department;
    private String position;
    private String phoneNumber;
    private String employeeImageUrl;
}
