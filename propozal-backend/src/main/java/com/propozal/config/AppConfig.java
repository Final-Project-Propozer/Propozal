package com.propozal.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module; // [추가] Hibernate6 모듈 import
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        // [추가] Hibernate6 모듈을 ObjectMapper에 등록합니다.
        Hibernate6Module hibernate6Module = new Hibernate6Module();
        // 이 옵션은 Lazy Loading된 프록시 객체를 실제 데이터로 강제로 초기화하여 변환해줍니다.
        hibernate6Module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, true);
        mapper.registerModule(hibernate6Module);

        return mapper;
    }
}