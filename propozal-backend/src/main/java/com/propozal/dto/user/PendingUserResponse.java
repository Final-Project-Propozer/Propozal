package com.propozal.dto.user;

import com.propozal.domain.User;
import lombok.Getter;

@Getter
public class PendingUserResponse {
    private Long id;
    private String email;
    private String name;
    private String role;

    public PendingUserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.role = user.getRole().name();
    }
}
