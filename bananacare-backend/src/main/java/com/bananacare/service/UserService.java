package com.bananacare.service;

import com.bananacare.dto.RegisterRequest;
import com.bananacare.entity.Role;
import com.bananacare.entity.User;
import com.bananacare.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        User user = User.builder()
            .name(request.getName())
            .email(email)
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .preferredLanguage(request.getPreferredLanguage())
            .role(Role.FARMER)
            .build();

        return userRepository.save(user);
    }
}
