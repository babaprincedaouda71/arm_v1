package org.example.trainingservice.exceptions;

import lombok.Getter;

@Getter
public class NeedNotFoundException extends RuntimeException {
    private final String field;

    public NeedNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}