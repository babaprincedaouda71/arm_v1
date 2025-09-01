package org.example.trainingservice.exceptions.plan;

import lombok.Getter;

import java.util.Map;

/**
 * Exception levée lors d'erreurs de validation des données d'entrée
 */
@Getter
public class ValidationException extends RuntimeException {

    private final String errorCode;
    private final Map<String, Object> details;

    public ValidationException(String message) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
        this.details = null;
    }

    public ValidationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.details = null;
    }

    public ValidationException(String message, Map<String, Object> details) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
        this.details = details;
    }

    public ValidationException(String message, String errorCode, Map<String, Object> details) {
        super(message);
        this.errorCode = errorCode;
        this.details = details;
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "VALIDATION_ERROR";
        this.details = null;
    }
}