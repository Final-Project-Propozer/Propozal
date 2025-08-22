package com.propozal.controller;

import com.propozal.domain.User;
import com.propozal.dto.user.LoginRequest;
import com.propozal.dto.user.LoginResponse;
import com.propozal.dto.user.SignupRequest;
import com.propozal.dto.user.UserInfoResponse;
import com.propozal.jwt.CustomUserDetails;
import com.propozal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.checkEmail(email));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        userService.signup(request.getEmail(), request.getPassword(), request.getName(), request.getRole(),
                request.getCompanyId());
        return ResponseEntity.ok().body("{\"message\": \"회원가입 요청이 완료되었습니다.\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(loginResponse);
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

    @GetMapping("/me")
    public ResponseEntity<?> getMyPage(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("{\"message\": \"로그인이 필요합니다.\"}");
        }

        UserInfoResponse response = UserInfoResponse.from(userDetails.getUser());
        return ResponseEntity.ok(response);
    }
}
