package org.example.authservice.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.authservice.dto.auth.*;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    SetPasswordResponse setPassword(SetPasswordRequest request);

    SetPasswordResponse setUserPassword(SetPasswordRequest request);

    void createPasswordToken(CreatePasswordTokenRequest request);

    void createPasswordResetToken(Long companyId, String email, String token);

    ResponseEntity<LoginResponse> login(LoginRequest request);

    String getTokenForEmail(String email);

    ResponseEntity<?> getProfile(HttpServletRequest request);

    ResponseEntity<?> getUserProfile(HttpServletRequest request);

    ResponseEntity<?> forgotPassword(ForgotPasswordRequest request);

    ResponseEntity<?> resetPassword(ResetPasswordRequest request);
}