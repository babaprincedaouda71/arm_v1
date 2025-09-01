package org.example.notificationservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.notificationservice.dto.CancelTrainingEmailRequest;
import org.example.notificationservice.dto.InvitationEmailRequest;
import org.example.notificationservice.entity.EmailNotificationRequest;
import org.example.notificationservice.repository.EmailRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class EmailServiceImpl implements EmailService {
    private final EmailRepository emailRepository;
    private final JavaMailSender mailSender;

    // Constantes pour les types d'emails
    public static final String EMAIL_TYPE_ACTIVATION = "ACTIVATION";
    public static final String EMAIL_TYPE_RESET_PASSWORD = "RESET_PASSWORD";

    public EmailServiceImpl(EmailRepository emailRepository, JavaMailSender mailSender) {
        this.emailRepository = emailRepository;
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(EmailNotificationRequest request) {
        // Déterminer le type d'email et appeler la méthode appropriée
        String emailType = request.getEmailType();
        if (emailType == null) {
            // Par défaut, utiliser l'activation si non spécifié
            emailType = EMAIL_TYPE_ACTIVATION;
        }

        switch (emailType) {
            case EMAIL_TYPE_ACTIVATION:
                sendActivationEmail(request);
                break;
            case EMAIL_TYPE_RESET_PASSWORD:
                sendResetPasswordEmail(request);
                break;
            default:
                throw new IllegalArgumentException("Type d'email non supporté: " + emailType);
        }
    }

    @Override
    public void sendCancellationEmails(CancelTrainingEmailRequest request) {
        if (request.getEmails() == null || request.getEmails().isEmpty()) {
            return;
        }

        // Traitement par batch pour optimiser les performances
        List<String> emailList = new ArrayList<>(request.getEmails());
        int batchSize = 50; // Configurable selon votre infrastructure

        for (int i = 0; i < emailList.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, emailList.size());
            List<String> batch = emailList.subList(i, endIndex);

            processBatch(batch, request.getObject(), request.getMessage());

            // Pause entre les batches pour éviter la surcharge
            if (endIndex < emailList.size()) {
                try {
                    Thread.sleep(100); // 100ms de pause
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }

    @Override
    public void sendInvitationEmails(InvitationEmailRequest request) {
        if (request.getEmails() == null || request.getEmails().isEmpty()) {
            return;
        }

        // Traitement par batch pour optimiser les performances
        List<String> emailList = new ArrayList<>(request.getEmails());
        int batchSize = 50; // Configurable selon votre infrastructure

        for (int i = 0; i < emailList.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, emailList.size());
            List<String> batch = emailList.subList(i, endIndex);

            processBatch(batch, request.getObject(), request.getMessage());

            // Pause entre les batches pour éviter la surcharge
            if (endIndex < emailList.size()) {
                try {
                    Thread.sleep(100); // 100ms de pause
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }

    private void processBatch(List<String> emails, String object, String messageContent) {
        for (String email : emails) {
            try {
                sendSingleEmail(email, object, messageContent);
            } catch (Exception e) {
                // Continuer avec les autres emails même si un envoi échoue
            }
        }
    }

    private void sendSingleEmail(String recipientEmail, String object, String messageContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Configuration de l'email
//            helper.setFrom("noreply@votre-domaine.com"); // À configurer
            helper.setTo(recipientEmail);
            helper.setSubject(object);

            // Corps du message avec contenu HTML de base
            String htmlContent = buildEmailContent(object, messageContent);
            helper.setText(htmlContent, true);

            // Envoi de l'email
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new EmailSendingException("Impossible d'envoyer l'email à " + recipientEmail, e);
        }
    }

    private String buildEmailContent(String subject, String messageContent) {
        // Conversion du message en HTML (remplacer les sauts de ligne par des <br>)
        String htmlMessage = messageContent
                .replace("\n", "<br>")
                .replace("  ", "&nbsp;&nbsp;"); // Préserver les espaces multiples

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                        .content { padding: 0; white-space: pre-line; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin: 0; color: #dc3545;">%s</h2>
                        </div>
                        <div class="content">
                            %s
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(subject, htmlMessage);
    }

    // Exception personnalisée
    public static class EmailSendingException extends RuntimeException {
        public EmailSendingException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    private void sendActivationEmail(EmailNotificationRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(request.getRecipient());
            helper.setSubject(request.getSubject() != null ? request.getSubject() : "Activation de votre compte");

            try (var inputStream = Objects.requireNonNull(EmailService.class.getResourceAsStream("/templates/activate-account-email-template.html"))) {
                String emailContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                emailContent = emailContent.replace("{{activation_link}}", request.getActivationLink());
                helper.setText(emailContent, true);
            }
            mailSender.send(message);
            System.out.println("Email d'activation envoyé avec succès");
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email d'activation: " + e.getMessage());
        }
    }

    private void sendResetPasswordEmail(EmailNotificationRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(request.getRecipient());
            helper.setSubject(request.getSubject() != null ? request.getSubject() : "Réinitialisation de votre mot de passe");

            try (var inputStream = Objects.requireNonNull(EmailService.class.getResourceAsStream("/templates/reset-password-email-template.html"))) {
                String emailContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                emailContent = emailContent.replace("{{reset_link}}", request.getResetLink());
                helper.setText(emailContent, true);
            }
            mailSender.send(message);
            System.out.println("Email de réinitialisation de mot de passe envoyé avec succès");
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email de réinitialisation: " + e.getMessage());
        }
    }
}