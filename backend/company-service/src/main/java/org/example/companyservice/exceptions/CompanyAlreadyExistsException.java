package org.example.companyservice.exceptions;

public class CompanyAlreadyExistsException extends RuntimeException {
    private String field;

    public CompanyAlreadyExistsException(String message, String field) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}