package com.propozal.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> handleCustomException(CustomException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", e.getErrorCode().getStatus().value());
        body.put("error", e.getErrorCode().getStatus().name());
        body.put("code", e.getErrorCode().getCode());
        body.put("message", e.getErrorCode().getMessage());

        return ResponseEntity.status(e.getErrorCode().getStatus()).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception e) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", 500);
        body.put("error", "Internal Server Error");
        body.put("message", e.getMessage());

        return ResponseEntity.status(500).body(body);
    }
}
