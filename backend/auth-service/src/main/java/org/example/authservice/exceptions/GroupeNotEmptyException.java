package org.example.authservice.exceptions;

import lombok.Getter;

@Getter
public class GroupeNotEmptyException extends RuntimeException {
    public GroupeNotEmptyException(String message) {
        super(message);
    }
}