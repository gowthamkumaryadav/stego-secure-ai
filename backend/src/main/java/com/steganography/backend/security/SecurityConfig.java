package com.steganography.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 🔥 Disable CSRF (required for H2)
            .csrf(csrf -> csrf.disable())

            // 🔥 Allow H2 console
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().permitAll()
            )

            // 🔥 Allow iframe (H2 uses frames)
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}