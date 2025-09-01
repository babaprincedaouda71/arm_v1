package org.example.companyservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(CompanyAlreadyExistsException.class)
    public final ResponseEntity<ErrorResponse> handleCompanyAlreadyExistsException(CompanyAlreadyExistsException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("COMPANY_ALREADY_EXISTS", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(StrategicAxesNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleStrategicAxesNotFoundException(StrategicAxesNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("STRATEGIC_AXES NOT FOUND", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SiteNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleSiteNotFoundException(SiteNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("SITE NOT FOUND", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DepartmentNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleDepartmentNotFoundException(DepartmentNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("DEPARTMENT NOT FOUND", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DomainNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleDomainNotFoundException(DomainNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("DOMAIN NOT FOUND", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(QualificationNotFoundException.class)
    public final ResponseEntity<ErrorResponse> handleQualificationNotFoundException(QualificationNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("DOMAIN NOT FOUND", ex.getMessage(), ex.getField());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidAuthenticationTokenException.class)
    public final ResponseEntity<ErrorResponse> handleInvalidAuthenticationTokenException(InvalidAuthenticationTokenException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("INVALID_TOKEN", ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }
}