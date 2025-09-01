package org.example.companyservice.exceptions;

import lombok.Getter;

@Getter
public class InvalidAuthenticationTokenException extends RuntimeException {
    private final String field;

    public InvalidAuthenticationTokenException(String message, String field) {
        super(message);
        this.field = field;
    }
}