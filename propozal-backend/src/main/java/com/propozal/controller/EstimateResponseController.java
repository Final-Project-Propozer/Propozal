package com.propozal.controller;

import com.propozal.service.EstimateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class EstimateResponseController {

    private final EstimateService estimateService;

    @GetMapping("/estimate/response")
    public String handleEstimateResponse(@RequestParam("token") String token, Model model) {
        String message;
        try {
            message = estimateService.processEstimateResponse(token);
        } catch (Exception e) {
            message = "오류가 발생했습니다: " + e.getMessage();
        }
        model.addAttribute("message", message);
        return "response-page";
    }
}