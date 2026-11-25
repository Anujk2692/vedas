package com.vedas.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler returning consistent, safe JSON error payloads
 * without leaking internal stack traces or class names.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
        int code = ex.getStatusCode().value();
        String message = ex.getReason() != null ? ex.getReason() : (status != null ? status.getReasonPhrase() : "Error");
        return build(code, status != null ? status.getReasonPhrase() : "Error", message);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + (fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "invalid"))
                .collect(Collectors.joining("; "));
        return build(HttpStatus.BAD_REQUEST.value(), "Validation Failed",
                details.isBlank() ? "Invalid request payload" : details);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MissingServletRequestParameterException.class})
    public ResponseEntity<Map<String, Object>> handleBadInput(Exception ex) {
        return build(HttpStatus.BAD_REQUEST.value(), "Bad Request", "Malformed or missing request input");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex) {
        log.error("Unhandled API exception", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
                "An unexpected error occurred. Please try again.");
    }

    private ResponseEntity<Map<String, Object>> build(int status, String error, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
