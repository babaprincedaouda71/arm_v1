package org.example.trainingservice.exceptions;

public class NeedCannotBeDeletedException extends RuntimeException {
  private final String field;
    public NeedCannotBeDeletedException(String message, String field) {
        super(message);
        this.field = field;
    }
}