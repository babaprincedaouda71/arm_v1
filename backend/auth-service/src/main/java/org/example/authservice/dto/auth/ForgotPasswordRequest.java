package org.example.authservice.dto.auth;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
}