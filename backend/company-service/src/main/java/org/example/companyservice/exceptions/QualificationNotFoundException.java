package org.example.companyservice.exceptions;

public class QualificationNotFoundException extends RuntimeException {
    private String field;

    public QualificationNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}