package com.bananacare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private String tokenType;

    private Long userId;

    private String name;

    private String email;

    private String role;
}