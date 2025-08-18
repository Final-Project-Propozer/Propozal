package com.propozal.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLoginRequest {
    private String provider;
    private String authCode;
}
