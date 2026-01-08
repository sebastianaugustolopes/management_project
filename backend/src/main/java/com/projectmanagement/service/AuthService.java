package com.projectmanagement.service;

import com.projectmanagement.dto.AuthResponse;
import com.projectmanagement.dto.LoginRequest;
import com.projectmanagement.dto.UserResponse;
import com.projectmanagement.model.User;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    // Create user if doesn't exist (for demo purposes)
                    User newUser = new User();
                    newUser.setId(UUID.randomUUID().toString());
                    newUser.setName(request.getEmail().split("@")[0]);
                    newUser.setEmail(request.getEmail());
                    newUser.setImage("");
                    return userRepository.save(newUser);
                });
        
        String token = tokenProvider.generateToken(user.getId());
        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getImage(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
        
        return new AuthResponse(token, userResponse);
    }
    
    @Transactional
    public AuthResponse register(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(name);
        user.setEmail(email);
        user.setImage("");
        
        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getId());
        
        UserResponse userResponse = new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getImage(),
            savedUser.getCreatedAt(),
            savedUser.getUpdatedAt()
        );
        
        return new AuthResponse(token, userResponse);
    }
}
