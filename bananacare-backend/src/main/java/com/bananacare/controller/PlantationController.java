package com.bananacare.controller;

import com.bananacare.dto.PlantationRequest;
import com.bananacare.dto.PlantationResponse;
import com.bananacare.dto.PlantationUpdateRequest;
import com.bananacare.service.PlantationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/plantations")
public class PlantationController {

    private final PlantationService plantationService;

    public PlantationController(
            PlantationService plantationService
    ) {
        this.plantationService = plantationService;
    }

    // CREATE PLANTATION
    @PostMapping
    public ResponseEntity<PlantationResponse> createPlantation(
            @Valid @RequestBody PlantationRequest request,
            Principal principal
    ) {

        PlantationResponse response =
                plantationService.createPlantation(
                        request,
                        principal.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL PLANTATIONS OF A FARM
    @GetMapping("/farm/{farmId}")
    public ResponseEntity<List<PlantationResponse>> getPlantationsByFarm(
            @PathVariable Long farmId,
            Principal principal
    ) {

        List<PlantationResponse> plantations =
                plantationService.getPlantationsByFarm(
                        farmId,
                        principal.getName()
                );

        return ResponseEntity.ok(plantations);
    }

    // GET SINGLE PLANTATION
    @GetMapping("/{plantationId}")
    public ResponseEntity<PlantationResponse> getPlantationById(
            @PathVariable Long plantationId,
            Principal principal
    ) {

        PlantationResponse plantation =
                plantationService.getPlantationById(
                        plantationId,
                        principal.getName()
                );

        return ResponseEntity.ok(plantation);
    }

    // UPDATE PLANTATION
    @PutMapping("/{plantationId}")
    public ResponseEntity<PlantationResponse> updatePlantation(
            @PathVariable Long plantationId,
            @Valid @RequestBody PlantationUpdateRequest request,
            Principal principal
    ) {

        PlantationResponse updatedPlantation =
                plantationService.updatePlantation(
                        plantationId,
                        request,
                        principal.getName()
                );

        return ResponseEntity.ok(updatedPlantation);
    }
}