package com.smart.safais.service;

import com.smart.safais.dto.UserLoginDto;
import com.smart.safais.dto.UserRegistrationDto;
import com.smart.safais.model.User;
import com.smart.safais.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Register a new user
     * @param registrationDto the user registration data
     * @return the created user
     * @throws RuntimeException if email already exists
     */
    public User registerUser(UserRegistrationDto registrationDto) {
        // Check if user already exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }
        
        // Create new user
        User user = new User(
            registrationDto.getName(),
            registrationDto.getEmail(),
            registrationDto.getPassword(), // In production, this should be encrypted
            registrationDto.getRole()
        );
        
        return userRepository.save(user);
    }
    
    /**
     * Authenticate user login
     * @param loginDto the login credentials
     * @return the authenticated user
     * @throws RuntimeException if credentials are invalid
     */
    public User loginUser(UserLoginDto loginDto) {
        Optional<User> userOptional = userRepository.findByEmail(loginDto.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // In production, use proper password hashing
        if (!user.getPassword().equals(loginDto.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return user;
    }
    
    /**
     * Find user by email
     * @param email the email to search for
     * @return Optional containing the user if found
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Find user by ID
     * @param id the user ID
     * @return Optional containing the user if found
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Get count of customers
     * @return number of customers
     */
    public long getCustomerCount() {
        return userRepository.countByRole("USER");
    }
    
    /**
     * Get count of drivers
     * @return number of drivers
     */
    public long getDriverCount() {
        return userRepository.countByRole("DRIVER");
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    /**
     * Delete user by ID
     * @param id the user ID to delete
     * @throws RuntimeException if user not found
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
} 