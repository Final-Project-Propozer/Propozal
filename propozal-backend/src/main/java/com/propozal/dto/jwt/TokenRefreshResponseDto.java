package com.propozal.dto.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshResponseDto {
    private String accessToken;
    private String refreshToken;
}
