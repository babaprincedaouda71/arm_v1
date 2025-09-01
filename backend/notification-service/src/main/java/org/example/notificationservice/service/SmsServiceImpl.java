package org.example.notificationservice.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.config.TwilioConfig;
import org.example.notificationservice.dto.OtpRequest;
import org.example.notificationservice.dto.OtpResponseDto;
import org.example.notificationservice.dto.OtpStatus;
import org.example.notificationservice.dto.OtpValidationRequest;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SmsServiceImpl implements SmsService {
    private final TwilioConfig twilioConfig;
    private final Map<String, String> otpMap = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public SmsServiceImpl(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    @Override
    public OtpResponseDto sendSMS(OtpRequest otpRequest) {
        OtpResponseDto otpResponseDto;
        try {
            PhoneNumber to = new PhoneNumber(otpRequest.getPhoneNumber());
            PhoneNumber from = new PhoneNumber(twilioConfig.getPhoneNumber());
            String otp = generateOTP();
            String otpMessage = "Votre code de vérification est : " + otp;
            Message.creator(to, from, otpMessage).create();
            otpMap.put(otpRequest.getUsername(), otp);
            otpResponseDto = new OtpResponseDto(OtpStatus.DELIVERED, otpMessage);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi du SMS", e);
            otpResponseDto = new OtpResponseDto(OtpStatus.FAILED, e.getMessage());
        }
        return otpResponseDto;
    }

    @Override
    public String validateOtp(OtpValidationRequest otpValidationRequest) {
        String storedOtp = otpMap.get(otpValidationRequest.getUsername());
        if (storedOtp != null && storedOtp.equals(otpValidationRequest.getOtpNumber())) {
            otpMap.remove(otpValidationRequest.getUsername());
            return "OTP is valid!";
        } else {
            return "OTP is invalid!";
        }
    }

    private String generateOTP() {
        return new DecimalFormat("000000").format(secureRandom.nextInt(999999));
    }
}