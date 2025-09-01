package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class GroupeException extends RuntimeException {
    public GroupeException(String message) {
        super(message);
    }
}