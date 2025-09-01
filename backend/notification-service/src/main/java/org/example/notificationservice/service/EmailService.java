package org.example.notificationservice.service;

import org.example.notificationservice.dto.CancelTrainingEmailRequest;
import org.example.notificationservice.dto.InvitationEmailRequest;
import org.example.notificationservice.entity.EmailNotificationRequest;

public interface EmailService {
    void sendEmail(EmailNotificationRequest request);

    void sendCancellationEmails(CancelTrainingEmailRequest request);

    void sendInvitationEmails(InvitationEmailRequest request);
}