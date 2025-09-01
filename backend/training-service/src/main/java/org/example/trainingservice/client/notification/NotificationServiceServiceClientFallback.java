package org.example.trainingservice.client.notification;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.model.plan.CancelTrainingEmailRequest;
import org.example.trainingservice.model.plan.SendInvitationEmailRequest;

@Slf4j
public class NotificationServiceServiceClientFallback implements NotificationServiceClient {
    @Override
    public void sendCancellationEmails(CancelTrainingEmailRequest request) {
        log.info("Fallback method called for sendCancellationEmails");
    }

    @Override
    public void sendInvitationEmails(SendInvitationEmailRequest request) {
        log.info("Fallback method called for sendInvitationEmails");
    }
}