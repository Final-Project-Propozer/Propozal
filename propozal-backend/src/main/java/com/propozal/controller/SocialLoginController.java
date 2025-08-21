package com.propozal.controller;

import com.propozal.dto.user.SocialLoginRequest;
import com.propozal.dto.user.LoginResponse;
import com.propozal.service.SocialLoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/social")
@RequiredArgsConstructor
public class SocialLoginController {

    private final SocialLoginService socialLoginService;

    @PostMapping("/login")
    public LoginResponse socialLogin(@RequestBody SocialLoginRequest request) {
        return socialLoginService.login(request);
    }
}
