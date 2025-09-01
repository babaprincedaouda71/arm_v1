package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class PasswordUpdateException extends RuntimeException {
    private final String field;
    public PasswordUpdateException(String message, String field) {
        super(message);
        this.field = field;
    }
}