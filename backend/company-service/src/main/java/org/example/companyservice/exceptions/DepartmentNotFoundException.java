package org.example.companyservice.exceptions;

public class DepartmentNotFoundException extends RuntimeException {
    private String field;

    public DepartmentNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}