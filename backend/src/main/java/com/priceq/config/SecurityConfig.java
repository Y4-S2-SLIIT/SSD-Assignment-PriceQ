package com.priceq.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Disable CSRF protection for your case
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        .httpStrictTransportSecurity(hsts -> hsts  // Enable HSTS
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)
                                .preload(true)
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()  // Ensure all requests are permitted
                );

        return http.build();
    }
}