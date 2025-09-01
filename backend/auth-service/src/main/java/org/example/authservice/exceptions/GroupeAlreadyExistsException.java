package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class GroupeAlreadyExistsException extends RuntimeException {
    public GroupeAlreadyExistsException(String message) {
        super(message);
    }
}