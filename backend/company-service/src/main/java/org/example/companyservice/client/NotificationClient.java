package org.example.companyservice.client;

import org.example.companyservice.dto.EmailNotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {
    @PostMapping("/api/notifications/email")
    void sendEmail(@RequestBody EmailNotificationRequest request);
}