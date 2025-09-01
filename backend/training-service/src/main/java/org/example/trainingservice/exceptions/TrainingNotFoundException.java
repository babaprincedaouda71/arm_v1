package org.example.trainingservice.exceptions;

import lombok.Getter;

@Getter
public class TrainingNotFoundException extends RuntimeException {
    private final String field;

    public TrainingNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}