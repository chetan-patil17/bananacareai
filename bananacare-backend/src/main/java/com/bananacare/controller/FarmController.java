package com.bananacare.controller;

import com.bananacare.dto.FarmRequest;
import com.bananacare.dto.FarmResponse;

import com.bananacare.service.FarmService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    private final FarmService farmService;

    public FarmController(
            FarmService farmService
    ) {
        this.farmService = farmService;
    }

    @PostMapping
    public ResponseEntity<FarmResponse> createFarm(
            @Valid @RequestBody FarmRequest request,
            Principal principal
    ) {

        FarmResponse response =
                farmService.createFarm(
                        request,
                        principal.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<FarmResponse>> getMyFarms(
            Principal principal
    ) {

        return ResponseEntity.ok(
                farmService.getMyFarms(
                        principal.getName()
                )
        );
    }

    @GetMapping("/{farmId}")
    public ResponseEntity<FarmResponse> getFarm(
            @PathVariable Long farmId,
            Principal principal
    ) {

        return ResponseEntity.ok(
                farmService.getFarm(
                        farmId,
                        principal.getName()
                )
        );
    }

    @PutMapping("/{farmId}")
    public ResponseEntity<FarmResponse> updateFarm(
            @PathVariable Long farmId,
            @Valid @RequestBody FarmRequest request,
            Principal principal
    ) {

        return ResponseEntity.ok(
                farmService.updateFarm(
                        farmId,
                        request,
                        principal.getName()
                )
        );
    }

    @DeleteMapping("/{farmId}")
    public ResponseEntity<?> deleteFarm(
            @PathVariable Long farmId,
            Principal principal
    ) {

        farmService.deleteFarm(
                farmId,
                principal.getName()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Farm deleted successfully"
                )
        );
    }
}