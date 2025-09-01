package org.example.trainingservice.exceptions;

import lombok.Getter;

@Getter
public class UserResponseNotFoundException extends RuntimeException {
    private final String field;

    public UserResponseNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}