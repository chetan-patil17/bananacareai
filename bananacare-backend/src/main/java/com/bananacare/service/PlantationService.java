package com.bananacare.service;

import com.bananacare.dto.PlantationRequest;
import com.bananacare.dto.PlantationResponse;
import com.bananacare.dto.PlantationUpdateRequest;
import com.bananacare.entity.Farm;
import com.bananacare.entity.GrowthStage;
import com.bananacare.entity.Plantation;
import com.bananacare.entity.PlantationStatus;
import com.bananacare.entity.User;
import com.bananacare.repository.FarmRepository;
import com.bananacare.repository.PlantationRepository;
import com.bananacare.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlantationService {

    private final PlantationRepository plantationRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public PlantationService(
            PlantationRepository plantationRepository,
            FarmRepository farmRepository,
            UserRepository userRepository
    ) {
        this.plantationRepository = plantationRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE PLANTATION
    // =========================================================

    @Transactional
    public PlantationResponse createPlantation(
            PlantationRequest request,
            String email
    ) {

        User user = getLoggedInUser(email);

        Farm farm = farmRepository
                .findByIdAndUser(request.getFarmId(), user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farm not found or access denied"
                        )
                );

        Plantation plantation = Plantation.builder()
                .plantationName(request.getPlantationName())
                .bananaVariety(request.getBananaVariety())
                .plantationDate(request.getPlantationDate())
                .numberOfPlants(request.getNumberOfPlants())
                .rowSpacing(request.getRowSpacing())
                .plantSpacing(request.getPlantSpacing())
                .growthStage(GrowthStage.PLANTED)
                .status(PlantationStatus.ACTIVE)
                .farm(farm)
                .build();

        Plantation savedPlantation =
                plantationRepository.save(plantation);

        return mapToResponse(savedPlantation);
    }

    // =========================================================
    // GET ALL PLANTATIONS OF FARM
    // =========================================================

    @Transactional(readOnly = true)
    public List<PlantationResponse> getPlantationsByFarm(
            Long farmId,
            String email
    ) {

        User user = getLoggedInUser(email);

        Farm farm = farmRepository
                .findByIdAndUser(farmId, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farm not found or access denied"
                        )
                );

        return plantationRepository
                .findByFarm(farm)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // GET SINGLE PLANTATION
    // =========================================================

    @Transactional(readOnly = true)
    public PlantationResponse getPlantationById(
            Long plantationId,
            String email
    ) {

        User user = getLoggedInUser(email);

        Plantation plantation = plantationRepository
                .findById(plantationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plantation not found"
                        )
                );

        verifyFarmOwnership(
                plantation.getFarm(),
                user
        );

        return mapToResponse(plantation);
    }

    // =========================================================
    // UPDATE PLANTATION
    // =========================================================

    @Transactional
    public PlantationResponse updatePlantation(
            Long plantationId,
            PlantationUpdateRequest request,
            String email
    ) {

        // Find logged-in farmer
        User user = getLoggedInUser(email);

        // Find plantation
        Plantation plantation = plantationRepository
                .findById(plantationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plantation not found"
                        )
                );

        // Verify ownership
        verifyFarmOwnership(
                plantation.getFarm(),
                user
        );

        // Convert requested growth stage String to Enum
        GrowthStage newGrowthStage;

        try {

            newGrowthStage =
                    GrowthStage.valueOf(
                            request.getGrowthStage()
                                    .trim()
                                    .toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid growth stage: "
                            + request.getGrowthStage()
            );
        }

        GrowthStage currentGrowthStage =
                plantation.getGrowthStage();

        // Temporary debugging
        System.out.println(
                "Current Stage: " + currentGrowthStage
        );

        System.out.println(
                "Requested Stage: " + newGrowthStage
        );

        // Validate lifecycle
        if (!isValidGrowthStageTransition(
                currentGrowthStage,
                newGrowthStage
        )) {

            throw new IllegalArgumentException(
                    "Invalid growth stage transition from "
                            + currentGrowthStage
                            + " to "
                            + newGrowthStage
            );
        }

        // Convert status String to Enum
        PlantationStatus newStatus;

        try {

            newStatus =
                    PlantationStatus.valueOf(
                            request.getStatus()
                                    .trim()
                                    .toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid plantation status: "
                            + request.getStatus()
            );
        }

        // Update fields
        plantation.setPlantationName(
                request.getPlantationName()
        );

        plantation.setBananaVariety(
                request.getBananaVariety()
        );

        plantation.setNumberOfPlants(
                request.getNumberOfPlants()
        );

        plantation.setRowSpacing(
                request.getRowSpacing()
        );

        plantation.setPlantSpacing(
                request.getPlantSpacing()
        );

        // IMPORTANT
        plantation.setGrowthStage(
                newGrowthStage
        );

        plantation.setExpectedHarvestDate(
                request.getExpectedHarvestDate()
        );

        plantation.setStatus(
                newStatus
        );

        System.out.println(
                "Stage after update: "
                        + plantation.getGrowthStage()
        );

        // Save changes
        Plantation updatedPlantation =
                plantationRepository.save(plantation);

        System.out.println(
                "Stage after save: "
                        + updatedPlantation.getGrowthStage()
        );

        return mapToResponse(updatedPlantation);
    }

    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

    private User getLoggedInUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    // =========================================================
    // VERIFY FARM OWNERSHIP
    // =========================================================

    private void verifyFarmOwnership(
            Farm farm,
            User user
    ) {

        farmRepository
                .findByIdAndUser(
                        farm.getId(),
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Plantation not found or access denied"
                        )
                );
    }

    // =========================================================
    // GROWTH STAGE TRANSITION VALIDATION
    // =========================================================

    private boolean isValidGrowthStageTransition(
            GrowthStage currentStage,
            GrowthStage newStage
    ) {

        // Same stage is allowed
        if (currentStage == newStage) {
            return true;
        }

        return switch (currentStage) {

            case PLANTED ->
                    newStage == GrowthStage.VEGETATIVE;

            case VEGETATIVE ->
                    newStage == GrowthStage.FLOWERING;

            case FLOWERING ->
                    newStage ==
                            GrowthStage.FRUIT_DEVELOPMENT;

            case FRUIT_DEVELOPMENT ->
                    newStage ==
                            GrowthStage.HARVEST_READY;

            case HARVEST_READY ->
                    newStage ==
                            GrowthStage.HARVESTED;

            case HARVESTED -> false;
        };
    }

    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private PlantationResponse mapToResponse(
            Plantation plantation
    ) {

        return PlantationResponse.builder()
                .id(plantation.getId())
                .farmId(
                        plantation.getFarm().getId()
                )
                .farmName(
                        plantation.getFarm().getFarmName()
                )
                .plantationName(
                        plantation.getPlantationName()
                )
                .bananaVariety(
                        plantation.getBananaVariety()
                )
                .plantationDate(
                        plantation.getPlantationDate()
                )
                .numberOfPlants(
                        plantation.getNumberOfPlants()
                )
                .rowSpacing(
                        plantation.getRowSpacing()
                )
                .plantSpacing(
                        plantation.getPlantSpacing()
                )
                .growthStage(
                        plantation.getGrowthStage().name()
                )
                .expectedHarvestDate(
                        plantation.getExpectedHarvestDate()
                )
                .status(
                        plantation.getStatus().name()
                )
                .createdAt(
                        plantation.getCreatedAt()
                )
                .updatedAt(
                        plantation.getUpdatedAt()
                )
                .build();
    }
}