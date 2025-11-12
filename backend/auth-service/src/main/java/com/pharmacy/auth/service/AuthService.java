package com.pharmacy.auth.service;

import com.pharmacy.auth.dto.LoginRequest;
import com.pharmacy.auth.dto.LoginResponse;
import com.pharmacy.auth.dto.RegisterRequest;
import com.pharmacy.auth.model.User;
import com.pharmacy.auth.repository.UserRepository;
import com.pharmacy.common.exception.PharmacyException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new PharmacyException("Email already registered", HttpStatus.CONFLICT);
        }
        
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new PharmacyException("Phone number already registered", HttpStatus.CONFLICT);
        }
        
        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(User.Role.valueOf(request.getRole()));
        user.setStatus(User.Status.ACTIVE);
        
        user = userRepository.save(user);
        
        // Generate token
        String token = jwtService.generateToken(user);
        
        // Build response
        LoginResponse.UserDto userDto = new LoginResponse.UserDto();
        userDto.setId(user.getId().toString());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().name());
        
        return new LoginResponse(userDto, token);
    }
    
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new PharmacyException("Invalid credentials", HttpStatus.UNAUTHORIZED));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new PharmacyException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        
        if (user.getStatus() != User.Status.ACTIVE) {
            throw new PharmacyException("Account is not active", HttpStatus.FORBIDDEN);
        }
        
        String token = jwtService.generateToken(user);
        
        LoginResponse.UserDto userDto = new LoginResponse.UserDto();
        userDto.setId(user.getId().toString());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().name());
        
        return new LoginResponse(userDto, token);
    }
}


