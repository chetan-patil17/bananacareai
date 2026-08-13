package com.bananacare.controller;

import com.bananacare.dto.AiPredictionResponse;
import com.bananacare.service.AiPredictionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
public class AiPredictionController {

    private final AiPredictionService aiPredictionService;

    public AiPredictionController(
            AiPredictionService aiPredictionService
    ) {
        this.aiPredictionService = aiPredictionService;
    }

    @PostMapping("/predict")
    public ResponseEntity<AiPredictionResponse> predictDisease(
            @RequestParam("image") MultipartFile image
    ) {

        AiPredictionResponse response =
                aiPredictionService.predict(image);

        return ResponseEntity.ok(response);
    }
}