package com.bananacare.service;

import com.bananacare.dto.DiseaseDetectionResponse;
import com.bananacare.entity.*;
import com.bananacare.repository.DiseaseDetectionRepository;
import com.bananacare.repository.FarmRepository;
import com.bananacare.repository.PlantationRepository;
import com.bananacare.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DiseaseDetectionService {

    private final DiseaseDetectionRepository diseaseDetectionRepository;
    private final PlantationRepository plantationRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final ImageStorageService imageStorageService;

    public DiseaseDetectionService(
            DiseaseDetectionRepository diseaseDetectionRepository,
            PlantationRepository plantationRepository,
            FarmRepository farmRepository,
            UserRepository userRepository,
            ImageStorageService imageStorageService
    ) {
        this.diseaseDetectionRepository = diseaseDetectionRepository;
        this.plantationRepository = plantationRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
        this.imageStorageService = imageStorageService;
    }

    @Transactional
    public DiseaseDetectionResponse uploadLeafImage(
            Long plantationId,
            MultipartFile image,
            String email
    ) {

        // 1. Find logged-in farmer
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 2. Find plantation
        Plantation plantation = plantationRepository
                .findById(plantationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plantation not found"
                        )
                );

        // 3. Verify plantation belongs to farmer
        Farm farm = plantation.getFarm();

        farmRepository
                .findByIdAndUser(farm.getId(), user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plantation not found or access denied"
                        )
                );

        // 4. Store banana leaf image
        String imageUrl =
                imageStorageService.storeImage(image);

        // 5. Create detection record
        DiseaseDetection detection =
                DiseaseDetection.builder()
                        .plantation(plantation)
                        .imageUrl(imageUrl)
                        .detectionStatus(
                                DetectionStatus.PENDING
                        )
                        .build();

        // 6. Save to MySQL
        DiseaseDetection savedDetection =
                diseaseDetectionRepository.save(detection);

        return mapToResponse(savedDetection);
    }

    private DiseaseDetectionResponse mapToResponse(
            DiseaseDetection detection
    ) {

        return DiseaseDetectionResponse.builder()
                .id(detection.getId())
                .plantationId(
                        detection.getPlantation().getId()
                )
                .plantationName(
                        detection.getPlantation()
                                .getPlantationName()
                )
                .imageUrl(
                        detection.getImageUrl()
                )
                .detectedDisease(
                        detection.getDetectedDisease()
                )
                .confidenceScore(
                        detection.getConfidenceScore()
                )
                .detectionStatus(
                        detection.getDetectionStatus().name()
                )
                .recommendation(
                        detection.getRecommendation()
                )
                .detectedAt(
                        detection.getDetectedAt()
                )
                .build();
    }
}