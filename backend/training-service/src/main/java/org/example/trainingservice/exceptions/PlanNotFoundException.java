package org.example.trainingservice.exceptions;

import lombok.Getter;

@Getter
public class PlanNotFoundException extends RuntimeException {
    private final String field;

    public PlanNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}