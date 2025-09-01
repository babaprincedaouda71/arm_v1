package org.example.trainingservice.exceptions;

import lombok.Getter;

@Getter
public class GroupeNotFoundException extends RuntimeException {
    private final String field;

    public GroupeNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}