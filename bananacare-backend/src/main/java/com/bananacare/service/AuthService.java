package com.bananacare.service;

import com.bananacare.dto.LoginRequest;
import com.bananacare.dto.LoginResponse;

import com.bananacare.entity.User;

import com.bananacare.repository.UserRepository;

import com.bananacare.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService
    ) {

        this.authenticationManager =
                authenticationManager;

        this.userRepository =
                userRepository;

        this.jwtService =
                jwtService;
    }

    public LoginResponse login(
            LoginRequest request
    ) {

        String email =
                request.getEmail()
                        .toLowerCase()
                        .trim();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}