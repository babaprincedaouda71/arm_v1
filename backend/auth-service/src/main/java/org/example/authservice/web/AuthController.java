package org.example.authservice.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.authservice.dto.auth.*;
import org.example.authservice.entity.PasswordResetToken;
import org.example.authservice.entity.PasswordToken;
import org.example.authservice.repository.PasswordResetTokenRepository;
import org.example.authservice.repository.PasswordTokenRepository;
import org.example.authservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final PasswordTokenRepository passwordTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthController(AuthService authService, PasswordTokenRepository passwordTokenRepository, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.authService = authService;
        this.passwordTokenRepository = passwordTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @PostMapping("/create-password-token")
    public ResponseEntity<Void> createPasswordToken(@RequestBody @Valid CreatePasswordTokenRequest request) {
        authService.createPasswordToken(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-email")
    public ResponseEntity<?> getEmailFromToken(@RequestParam String token) {
        Optional<PasswordToken> byToken = passwordTokenRepository.findByToken(token);
        if (byToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Token invalide ou expiré !"));
        }
        return ResponseEntity.ok(Collections.singletonMap("email", byToken.get().getEmail()));
    }

    @GetMapping("/get-email-from-reset-token")
    public ResponseEntity<?> getEmailFromResetToken(@RequestParam String token) {
        Optional<PasswordResetToken> byToken = passwordResetTokenRepository.findByToken(token);
        if (byToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Token invalide ou expiré !"));
        }
        return ResponseEntity.ok(Collections.singletonMap("email", byToken.get().getEmail()));
    }

    @PostMapping("/set-password")
    public SetPasswordResponse setPassword(@Valid @RequestBody SetPasswordRequest request) {
        return authService.setPassword(request);
    }

    @PostMapping("/set-user-password")
    public SetPasswordResponse setUserPassword(@Valid @RequestBody SetPasswordRequest request) {
        return authService.setUserPassword(request);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        return authService.getProfile(request);
    }

    @GetMapping("/userProfile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        return authService.getUserProfile(request);
    }

    @GetMapping("/token/{email}")
    public ResponseEntity<String> getTokenForEmail(@PathVariable String email) {
        // Cet endpoint est utilisé à des fins de débogage et de test uniquement
        // Ne pas utiliser en production
        String token = authService.getTokenForEmail(email);
        if (token == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(token);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}