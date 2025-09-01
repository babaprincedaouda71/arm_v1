package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class GroupeNotFoundException extends RuntimeException {
    public GroupeNotFoundException(String message) {
        super(message);
    }
}