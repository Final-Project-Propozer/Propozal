package com.propozal.backend.controller;

import com.propozal.backend.domain.User;
import com.propozal.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    private final UserRepository userRepository;

    public TestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/db")
    public String testDb() {
        long count = userRepository.count();
        return "현재 User 테이블 행 개수: " + count;
    }

    @PostMapping("/db")
    public String addUser(@RequestBody User user) {
        userRepository.save(user);
        return "사용자 저장 완료: " + user.getEmail();
    }
}
