package org.example.companyservice.client;

import org.example.companyservice.dto.CreatePasswordResetTokenRequest;
import org.example.companyservice.dto.CreatePasswordTokenRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthClient {
    @PostMapping("/api/auth/create-password-reset-token")
    void createPasswordResetToken(@RequestBody CreatePasswordResetTokenRequest request);

    @PostMapping("/api/auth/create-password-token")
    void createPasswordToken(@RequestBody CreatePasswordTokenRequest request);
}