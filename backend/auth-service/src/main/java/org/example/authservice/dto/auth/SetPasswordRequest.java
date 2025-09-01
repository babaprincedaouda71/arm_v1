package org.example.authservice.dto.auth;

import lombok.Data;

@Data
public class SetPasswordRequest {
    private String email;

    private String token;

    private String password;

    private String confirmationPassword;
}