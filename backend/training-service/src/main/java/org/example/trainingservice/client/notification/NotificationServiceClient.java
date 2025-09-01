package org.example.trainingservice.client.notification;

import org.example.trainingservice.model.plan.CancelTrainingEmailRequest;
import org.example.trainingservice.model.plan.SendInvitationEmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "NOTIFICATION-SERVICE", fallback = NotificationServiceServiceClientFallback.class)
public interface NotificationServiceClient {
    @PostMapping("/api/notifications/cancellation-emails")
    void sendCancellationEmails(@RequestBody CancelTrainingEmailRequest request);

    @PostMapping("/api/notifications/invitation-emails")
    void sendInvitationEmails(@RequestBody SendInvitationEmailRequest request);
}