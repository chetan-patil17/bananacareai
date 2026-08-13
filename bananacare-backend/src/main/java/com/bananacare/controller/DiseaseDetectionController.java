package com.bananacare.controller;

import com.bananacare.dto.DiseaseDetectionResponse;
import com.bananacare.service.DiseaseDetectionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/disease-detections")
public class DiseaseDetectionController {

    private final DiseaseDetectionService diseaseDetectionService;

    public DiseaseDetectionController(
            DiseaseDetectionService diseaseDetectionService
    ) {
        this.diseaseDetectionService = diseaseDetectionService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<DiseaseDetectionResponse> uploadLeafImage(

            @RequestParam("plantationId")
            Long plantationId,

            @RequestParam("image")
            MultipartFile image,

            Principal principal
    ) {

        DiseaseDetectionResponse response =
                diseaseDetectionService.uploadLeafImage(
                        plantationId,
                        image,
                        principal.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}