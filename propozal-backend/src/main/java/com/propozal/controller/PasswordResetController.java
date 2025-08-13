package com.propozal.controller;

import com.propozal.dto.user.MessageResponse;
import com.propozal.dto.user.PasswordResetConfirmRequest;
import com.propozal.dto.user.PasswordResetRequestDto;
import com.propozal.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password-reset")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public MessageResponse request(@Valid @RequestBody PasswordResetRequestDto req) {
        passwordResetService.requestReset(req.getEmail());
        return new MessageResponse("비밀번호 재설정 메일이 발송되었습니다.");
    }

    @GetMapping("/verify")
    public MessageResponse verify(@RequestParam("token") String token) {
        passwordResetService.verifyToken(token);
        return new MessageResponse("토큰 검증 완료. 비밀번호 변경 가능");
    }

    @PostMapping("/confirm")
    public MessageResponse confirm(@Valid @RequestBody PasswordResetConfirmRequest req) {
        passwordResetService.confirmReset(req.getToken(), req.getNewPassword());
        return new MessageResponse("비밀번호가 성공적으로 변경되었습니다.");
    }
}
