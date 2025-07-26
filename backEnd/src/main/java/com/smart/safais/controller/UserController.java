package com.smart.safais.controller;

import com.smart.safais.dto.ApiResponse;
import com.smart.safais.dto.UserLoginDto;
import com.smart.safais.dto.UserRegistrationDto;
import com.smart.safais.model.User;
import com.smart.safais.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Register a new user
     * @param registrationDto the user registration data
     * @return API response with user data
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@RequestBody UserRegistrationDto registrationDto) {
        try {
            User user = userService.registerUser(registrationDto);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Login user
     * @param loginDto the login credentials
     * @return API response with user data
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> loginUser(@RequestBody UserLoginDto loginDto) {
        try {
            User user = userService.loginUser(loginDto);
            return ResponseEntity.ok(ApiResponse.success("Login successful", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get user by ID
     * @param id the user ID
     * @return API response with user data
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        try {
            return userService.findById(id)
                    .map(user -> ResponseEntity.ok(ApiResponse.success("User found", user)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving user"));
        }
    }
    
    /**
     * Get count of customers
     * @return API response with customer count
     */
    @GetMapping("/count/customers")
    public ResponseEntity<ApiResponse<Long>> getCustomerCount() {
        try {
            long count = userService.getCustomerCount();
            return ResponseEntity.ok(ApiResponse.success("Customer count retrieved successfully", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving customer count"));
        }
    }
    
    /**
     * Get count of drivers
     * @return API response with driver count
     */
    @GetMapping("/count/drivers")
    public ResponseEntity<ApiResponse<Long>> getDriverCount() {
        try {
            long count = userService.getDriverCount();
            return ResponseEntity.ok(ApiResponse.success("Driver count retrieved successfully", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving driver count"));
        }
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByRole(@PathVariable String role) {
        try {
            List<User> users = userService.getUsersByRole(role);
            return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving users: " + e.getMessage(), null));
        }
    }
    
    /**
     * Health check endpoint
     * @return simple success message
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("User service is running"));
    }
} 