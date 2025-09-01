package org.example.trainingservice.exceptions.plan;

import lombok.Getter;

import java.util.Map;

/**
 * Exception levée lors d'erreurs d'envoi de notifications
 */
@Getter
public class NotificationException extends RuntimeException {

    private final String errorCode;
    private final Map<String, Object> details;

    public NotificationException(String message) {
        super(message);
        this.errorCode = "NOTIFICATION_ERROR";
        this.details = null;
    }

    public NotificationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.details = null;
    }

    public NotificationException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "NOTIFICATION_ERROR";
        this.details = null;
    }

    public NotificationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.details = null;
    }

    public NotificationException(String message, Map<String, Object> details) {
        super(message);
        this.errorCode = "NOTIFICATION_ERROR";
        this.details = details;
    }

    public NotificationException(String message, String errorCode, Map<String, Object> details, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.details = details;
    }
}