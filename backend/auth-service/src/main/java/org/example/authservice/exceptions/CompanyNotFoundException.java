package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class CompanyNotFoundException extends RuntimeException {
    private final String field;
    public CompanyNotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}