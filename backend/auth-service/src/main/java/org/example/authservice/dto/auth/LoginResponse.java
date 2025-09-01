package org.example.authservice.dto.auth;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.authservice.entity.Groupe;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private Long companyId;
    private String role;
    private Groupe groupe;
    private String email;
    private boolean registrationCompleted;
}