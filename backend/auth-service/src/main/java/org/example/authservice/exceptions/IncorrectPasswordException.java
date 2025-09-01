package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class IncorrectPasswordException extends RuntimeException {
    private final String field;
    public IncorrectPasswordException(String message, String field) {
        super(message);
        this.field = field;
    }
}