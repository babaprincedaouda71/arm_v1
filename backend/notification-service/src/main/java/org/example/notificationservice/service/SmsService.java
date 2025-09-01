package org.example.notificationservice.service;

import org.example.notificationservice.dto.OtpRequest;
import org.example.notificationservice.dto.OtpResponseDto;
import org.example.notificationservice.dto.OtpValidationRequest;

public interface SmsService {
    OtpResponseDto sendSMS(OtpRequest otpRequest);

    String validateOtp(OtpValidationRequest otpValidationRequest);
}