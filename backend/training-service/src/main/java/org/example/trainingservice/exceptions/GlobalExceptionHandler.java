package org.example.trainingservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(InvalidAuthenticationTokenException.class)
    public final ResponseEntity<ErrorResponse> handleInvalidAuthenticationTokenException(InvalidAuthenticationTokenException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("INVALID_TOKEN", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NeedNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleNeedNotFoundException(NeedNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("NO_NEED", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(GroupeNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleGroupeNotFoundException(GroupeNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("NO_GROUP", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NeedCannotBeDeletedException.class)
    public final ResponseEntity<ErrorResponse> handleNeedCannotBeDeletedException(NeedCannotBeDeletedException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("NEED_CANNOT_BE_DELETED", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(TrainingRequestNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleTrainingRequestNotFindException(TrainingRequestNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("TRAINING_REQUEST_NOT_FOUND", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UserResponseNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleTrainingRequestNotFindException(UserResponseNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("USER_RESPONSE_NOT_FOUND", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(TrainingNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleTrainingNotFoundException(TrainingNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("NO_TRAINING", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(TrainingGroupeNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleTrainingGroupeNotFoundException(TrainingGroupeNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("NO_TRAINING_GROUPE", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(PlanNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handlePlanNotFoundException(PlanNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("NO_PLAN", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }
}