package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class PasswordMismatchException extends RuntimeException {
    private final String field;
    public PasswordMismatchException(String message, String field) {
        super(message);
        this.field = field;
    }
}