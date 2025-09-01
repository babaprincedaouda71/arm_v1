package org.example.authservice.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

public class CookieUtils {
    @Value("${app.expiration-time}")
    private Long jwtExpiration;

    private ResponseCookie createSecureCookie(String token) {
        return ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpiration))
                .build();
    }
}