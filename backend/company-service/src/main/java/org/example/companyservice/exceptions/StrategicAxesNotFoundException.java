package org.example.companyservice.exceptions;

public class StrategicAxesNotFoundException extends RuntimeException {
    private String field;

    public StrategicAxesNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}