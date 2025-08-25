package com.propozal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class PropozalBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PropozalBackendApplication.class, args);
	}
}