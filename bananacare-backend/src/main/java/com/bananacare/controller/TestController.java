package com.bananacare.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public Map<String, String> protectedEndpoint(Principal principal) {
        return Map.of(
                "message", "JWT authentication is working",
                "loggedInUser", principal.getName()
        );
    }
}