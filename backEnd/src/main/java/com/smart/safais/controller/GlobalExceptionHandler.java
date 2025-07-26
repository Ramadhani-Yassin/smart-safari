package com.smart.safais.controller;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.smart.safais.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<String>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        System.err.println("❌ JSON parsing error: " + ex.getMessage());
        System.err.println("❌ Root cause: " + ex.getRootCause());
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Invalid JSON format: " + ex.getMessage(), null));
    }

    @ExceptionHandler(JsonParseException.class)
    public ResponseEntity<ApiResponse<String>> handleJsonParseException(JsonParseException ex) {
        System.err.println("❌ JSON parse exception: " + ex.getMessage());
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "JSON parsing error: " + ex.getMessage(), null));
    }

    @ExceptionHandler(JsonMappingException.class)
    public ResponseEntity<ApiResponse<String>> handleJsonMappingException(JsonMappingException ex) {
        System.err.println("❌ JSON mapping exception: " + ex.getMessage());
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "JSON mapping error: " + ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<String>> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        System.err.println("❌ Method argument type mismatch: " + ex.getMessage());
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Invalid argument type: " + ex.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGenericException(Exception ex) {
        System.err.println("❌ Generic exception: " + ex.getMessage());
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Internal server error: " + ex.getMessage(), null));
    }
} 