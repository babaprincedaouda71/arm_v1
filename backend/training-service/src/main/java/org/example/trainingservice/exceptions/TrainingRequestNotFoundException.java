package org.example.trainingservice.exceptions;

import lombok.Getter;

@Getter
public class TrainingRequestNotFoundException extends RuntimeException {
    private final String field;

    public TrainingRequestNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}