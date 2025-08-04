package com.propozal.backend.controller;

import com.propozal.backend.dto.request.LoginRequest;
import com.propozal.backend.dto.request.SignupRequest;
import com.propozal.backend.dto.response.LoginResponse;
import com.propozal.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        userService.registerUser(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입 요청이 완료되었습니다. 관리자 승인 후 이용 가능합니다.");

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.checkEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("available", !exists);
        response.put("message", exists ? "이미 가입된 이메일입니다." : "사용 가능한 이메일입니다.");

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.loginUser(request));
    }
}
