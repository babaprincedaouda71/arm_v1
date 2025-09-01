package org.example.trainingservice.exceptions;

import lombok.Getter;

@Getter
public class TrainingGroupeNotFoundException extends RuntimeException {
    private final String field;

    public TrainingGroupeNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}