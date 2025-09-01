package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class TokenExpiredException extends RuntimeException {
    private final String field;

    public TokenExpiredException(String message, String field) {
        super(message);
        this.field = field;
    }
}