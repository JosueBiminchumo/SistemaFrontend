package com.mediturno.backend.common.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import com.mediturno.backend.auth.exception.EmailAlreadyRegisteredException;
import com.mediturno.backend.auth.exception.RegistrationDisabledException;
import com.mediturno.backend.common.dto.ApiError;
import com.mediturno.backend.common.exception.InvalidRequestException;
import com.mediturno.backend.common.exception.ResourceConflictException;
import com.mediturno.backend.common.exception.ResourceNotFoundException;
import com.mediturno.backend.patient.exception.DocumentNumberAlreadyRegisteredException;
import com.mediturno.backend.patient.exception.PatientProfileNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ApiError> handleInvalidRequest(
            InvalidRequestException exception,
            HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ApiError> handleConflict(
            ResourceConflictException exception,
            HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(
            AccessDeniedException exception,
            HttpServletRequest request) {
        return error(HttpStatus.FORBIDDEN, "No tienes permisos para esta acción.", request, Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        Map<String, String> details = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                details.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return error(HttpStatus.BAD_REQUEST, "La solicitud contiene datos inválidos.", request, details);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableBody(
            HttpMessageNotReadableException exception,
            HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, "El cuerpo de la solicitud no es válido.", request, Map.of());
    }

    @ExceptionHandler({
            MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class
    })
    public ResponseEntity<ApiError> handleBadParameter(
            Exception exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.BAD_REQUEST,
                "Un parámetro de la solicitud es inválido o falta.",
                request,
                Map.of());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> handleMethodNotAllowed(
            HttpRequestMethodNotSupportedException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.METHOD_NOT_ALLOWED,
                "El método HTTP no está permitido para esta ruta.",
                request,
                Map.of());
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ApiError> handleDuplicateEmail(
            EmailAlreadyRegisteredException exception,
            HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(DocumentNumberAlreadyRegisteredException.class)
    public ResponseEntity<ApiError> handleDuplicateDocumentNumber(
            DocumentNumberAlreadyRegisteredException exception,
            HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(PatientProfileNotFoundException.class)
    public ResponseEntity<ApiError> handlePatientProfileNotFound(
            PatientProfileNotFoundException exception,
            HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(
            DataIntegrityViolationException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.CONFLICT,
                "No se pudo guardar la información por un conflicto de datos.",
                request,
                Map.of());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthentication(
            AuthenticationException exception,
            HttpServletRequest request) {
        return error(HttpStatus.UNAUTHORIZED, "Credenciales inválidas.", request, Map.of());
    }

    @ExceptionHandler(RegistrationDisabledException.class)
    public ResponseEntity<ApiError> handleRegistrationDisabled(
            RegistrationDisabledException exception,
            HttpServletRequest request) {
        return error(HttpStatus.FORBIDDEN, exception.getMessage(), request, Map.of());
    }

    private ResponseEntity<ApiError> error(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> details) {
        ApiError body = new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                Map.copyOf(details));
        return ResponseEntity.status(status).body(body);
    }
}
