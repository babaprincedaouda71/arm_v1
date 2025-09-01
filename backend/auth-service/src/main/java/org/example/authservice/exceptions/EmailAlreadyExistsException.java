package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}