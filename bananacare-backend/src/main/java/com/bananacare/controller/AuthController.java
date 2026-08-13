package com.bananacare.controller;

import com.bananacare.dto.LoginRequest;
import com.bananacare.dto.LoginResponse;
import com.bananacare.dto.RegisterRequest;

import com.bananacare.entity.User;

import com.bananacare.service.AuthService;
import com.bananacare.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    private final AuthService authService;

    public AuthController(
            UserService userService,
            AuthService authService
    ) {

        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid
            @RequestBody RegisterRequest request
    ) {

        User user =
                userService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        Map.of(
                                "message",
                                "Registration successful",

                                "userId",
                                user.getId(),

                                "name",
                                user.getName(),

                                "email",
                                user.getEmail()
                        )
                );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid
            @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}