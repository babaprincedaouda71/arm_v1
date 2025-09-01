package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class EmailDoesNotExistException extends RuntimeException {
    public EmailDoesNotExistException(String message) {
        super(message);
    }
}