package org.example.notificationservice.web;

import org.example.notificationservice.dto.CancelTrainingEmailRequest;
import org.example.notificationservice.dto.InvitationEmailRequest;
import org.example.notificationservice.entity.EmailNotificationRequest;
import org.example.notificationservice.service.EmailService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class EmailController {
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/email")
    void sendEmail(@RequestBody EmailNotificationRequest request) {
        emailService.sendEmail(request);
    }

    @PostMapping("/cancellation-emails")
    void sendCancellationEmails(@RequestBody CancelTrainingEmailRequest request) {
        emailService.sendCancellationEmails(request);
    }

    @PostMapping("/invitation-emails")
    void sendInvitationEmails(@RequestBody InvitationEmailRequest request) {
        emailService.sendInvitationEmails(request);
    }
}