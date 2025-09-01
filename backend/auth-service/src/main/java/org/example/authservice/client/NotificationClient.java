package org.example.authservice.client;

import org.example.authservice.dto.EmailNotificationRequest;
import org.example.authservice.dto.NotificationsRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {
    @PostMapping("/api/notifications/email")
    void sendEmail(@RequestBody EmailNotificationRequest request);

    @PostMapping("/api/notifications/add")
    void sendAddNotification(@RequestBody NotificationsRequest notifications);
}