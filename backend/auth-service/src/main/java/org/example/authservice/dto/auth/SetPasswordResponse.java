package org.example.authservice.dto.auth;

import lombok.Data;

@Data
public class SetPasswordResponse {
    private Long companyId;
    private String email;
}