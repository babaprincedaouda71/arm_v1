package org.example.companyservice.exceptions;

public class DomainNotFoundException extends RuntimeException {
    private String field;

    public DomainNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}