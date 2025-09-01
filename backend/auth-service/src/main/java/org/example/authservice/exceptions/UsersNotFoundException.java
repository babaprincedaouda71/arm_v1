package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class UsersNotFoundException extends RuntimeException {
    public UsersNotFoundException(String message) {
        super(message);
    }
}