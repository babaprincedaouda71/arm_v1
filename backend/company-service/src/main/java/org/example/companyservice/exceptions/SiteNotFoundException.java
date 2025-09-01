package org.example.companyservice.exceptions;

public class SiteNotFoundException extends RuntimeException {
    private String field;

    public SiteNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}