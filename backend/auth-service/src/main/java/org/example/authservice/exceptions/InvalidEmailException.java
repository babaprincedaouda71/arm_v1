package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class InvalidEmailException extends RuntimeException {
    private final String field;
    public InvalidEmailException(String message, String field) {
        super(message);
        this.field = field;
    }
}