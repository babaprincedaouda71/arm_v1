package org.example.notificationservice.web;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.dto.OtpRequest;
import org.example.notificationservice.dto.OtpResponseDto;
import org.example.notificationservice.dto.OtpStatus;
import org.example.notificationservice.dto.OtpValidationRequest;
import org.example.notificationservice.service.SmsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/otp")
@Slf4j
public class SmsController {
    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @GetMapping("/process")
    public String processSMS() {
        return "SMS sent";
    }

    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponseDto> sendOtp(@Valid @RequestBody OtpRequest otpRequest) {
        log.info("Sending OTP request for username: {}", otpRequest.getUsername());
        try {
            OtpResponseDto response = smsService.sendSMS(otpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to send OTP for username: {}", otpRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new OtpResponseDto(OtpStatus.FAILED, e.getMessage()));
        }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<String> validateOtp(@Valid @RequestBody OtpValidationRequest otpValidationRequest) {
        log.info("Validating OTP for username: {}", otpValidationRequest.getUsername());
        try {
            String validationResult = smsService.validateOtp(otpValidationRequest);
            return ResponseEntity.ok(validationResult);
        } catch (Exception e) {
            log.error("Failed to validate OTP for username: {}", otpValidationRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to validate OTP: " + e.getMessage());
        }
    }
}