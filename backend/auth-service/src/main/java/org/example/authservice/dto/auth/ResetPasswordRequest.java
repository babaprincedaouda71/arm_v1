package org.example.authservice.dto.auth;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String password;
}