package com.propozal.controller;

import com.propozal.domain.User;
import com.propozal.dto.user.LoginRequest;
import com.propozal.dto.user.LoginResponse;
import com.propozal.dto.user.SignupRequest;
import com.propozal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.checkEmail(email));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        userService.signup(request.getEmail(), request.getPassword(), request.getName(), request.getRole());
        return ResponseEntity.ok().body("{\"message\": \"회원가입 요청이 완료되었습니다.\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/social/login")
    public ResponseEntity<?> socialLogin(@RequestParam String provider,
                                         @RequestParam String authCode) {
        return ResponseEntity.ok(userService.socialLogin(provider, authCode));
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<List<User>> getPendingApprovals() {
        return ResponseEntity.ok(userService.getPendingApprovals());
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        userService.approveUser(id);
        return ResponseEntity.ok().body("{\"message\": \"승인 완료\"}");
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationEmail(@RequestParam Long userId,
                                                   @RequestParam String email) {
        userService.sendVerificationEmail(userId, email);
        return ResponseEntity.ok("{\"message\": \"인증 메일 발송 완료\"}");
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok("{\"message\": \"이메일 인증 완료\"}");
    }
}
