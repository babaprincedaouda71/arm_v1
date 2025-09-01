package org.example.authservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(PasswordMismatchException.class)
    public final ResponseEntity<ErrorResponse> handlePasswordMismatchException(PasswordMismatchException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("PASSWORD_MISMATCH", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidEmailException.class)
    public final ResponseEntity<ErrorResponse> handleInvalidEmailException(InvalidEmailException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("INVALID_EMAIL", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public final ResponseEntity<ErrorResponse> handleTokenExpiredException(TokenExpiredException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("TOKEN_EXPIRED", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CompanyNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleCompanyNotFoundException(CompanyNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("COMPANY_NOT_FOUND", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("USER_NOT_FOUND", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UsersNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleUsersNotFoundException(UsersNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("USER_NOT_FOUND", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PasswordUpdateException.class)
    public final ResponseEntity<ErrorResponse> handlePasswordUpdateException(PasswordUpdateException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("PASSWORD_UPDATE", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IncorrectPasswordException.class)
    public final ResponseEntity<ErrorResponse> handleIncorrectPasswordException(IncorrectPasswordException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("INCORRECT_PASSWORD", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public final ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("INVALID_CREDENTIALS", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailDoesNotExistException.class)
    public final ResponseEntity<ErrorResponse> handleEmailDoesNotExistException(EmailDoesNotExistException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("EMAIL_DOES_NOT_EXIST", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public final ResponseEntity<ErrorResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("EMAIL_ALREADY_EXISTS", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(GroupeException.class)
    public final ResponseEntity<ErrorResponse> handleGroupeException(GroupeException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("GROUP_PROBLEM", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(GroupeNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleGroupeNotFoundException(GroupeNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("GROUP_NOT_FOUND", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(GroupeNotEmptyException.class)
    public final ResponseEntity<ErrorResponse> handleGroupeNotEmptyException(GroupeNotEmptyException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("GROUP_NOT_EMPTY", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(GroupeAlreadyExistsException.class)
    public final ResponseEntity<ErrorResponse> handleGroupeAlreadyExistsException(GroupeAlreadyExistsException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("GROUP_NOT_EMPTY", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("INTERNAL_SERVER_ERROR", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(InvalidAuthenticationTokenException.class)
    public final ResponseEntity<ErrorResponse> handleInvalidAuthenticationTokenException(InvalidAuthenticationTokenException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("INVALID_TOKEN", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }
}