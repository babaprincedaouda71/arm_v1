package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {
    private final String field;
    public UserNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}