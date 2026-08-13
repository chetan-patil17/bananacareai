package com.bananacare.service;

import com.bananacare.dto.DiagnosisSummaryResponse;


import com.bananacare.dto.AiPredictionResponse;
import com.bananacare.dto.DiagnosisResponse;
import com.bananacare.entity.Diagnosis;
import com.bananacare.entity.Plantation;
import com.bananacare.repository.DiagnosisRepository;
import com.bananacare.repository.PlantationRepository;

import com.bananacare.service.DiseaseRecommendationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DiagnosisService {

    // =====================================================
    // DEPENDENCIES
    // =====================================================

    private final DiagnosisRepository diagnosisRepository;

    private final PlantationRepository plantationRepository;

    private final AiPredictionService aiPredictionService;

    private final DiseaseRecommendationService diseaseRecommendationService;


    // =====================================================
    // IMAGE STORAGE DIRECTORY
    // =====================================================

    /*
     * Images will be stored inside:
     *
     * bananacare-backend/
     * └── uploads/
     *     └── diagnoses/
     */

    private static final Path DIAGNOSIS_UPLOAD_DIR =
            Paths.get(
                            "uploads",
                            "diagnoses"
                    )
                    .toAbsolutePath()
                    .normalize();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DiagnosisService(
            DiagnosisRepository diagnosisRepository,
            PlantationRepository plantationRepository,
            AiPredictionService aiPredictionService,
            DiseaseRecommendationService diseaseRecommendationService
    ) {

        this.diagnosisRepository =
                diagnosisRepository;

        this.plantationRepository =
                plantationRepository;

        this.aiPredictionService =
                aiPredictionService;

        this.diseaseRecommendationService =
                diseaseRecommendationService;
    }


    // =====================================================
    // CREATE DIAGNOSIS
    // =====================================================

    @Transactional
    public DiagnosisResponse diagnose(
            Long plantationId,
            MultipartFile image,
            String userEmail
    ) {

        // -------------------------------------------------
        // Validate image
        // -------------------------------------------------

        if (image == null || image.isEmpty()) {

            throw new IllegalArgumentException(
                    "Banana leaf image is required"
            );
        }


        // -------------------------------------------------
        // Find plantation
        // -------------------------------------------------

        Plantation plantation =
                plantationRepository
                        .findById(plantationId)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Plantation not found"
                                        )
                        );


        // -------------------------------------------------
        // Verify plantation ownership
        // -------------------------------------------------

        String plantationOwnerEmail =
                plantation
                        .getFarm()
                        .getUser()
                        .getEmail();


        if (
                plantationOwnerEmail == null ||
                        userEmail == null ||
                        !plantationOwnerEmail.equalsIgnoreCase(
                                userEmail
                        )
        ) {

            throw new SecurityException(
                    "You are not authorised to access this plantation"
            );
        }


        // -------------------------------------------------
        // Send image to FastAPI / TensorFlow
        // -------------------------------------------------

        AiPredictionResponse aiResponse =
                aiPredictionService.predict(
                        image
                );


        if (aiResponse == null) {

            throw new IllegalStateException(
                    "AI service returned an empty response"
            );
        }


        String storedImagePath = null;


        try {

            // =================================================
            // CREATE UPLOAD DIRECTORY
            // =================================================

            Files.createDirectories(
                    DIAGNOSIS_UPLOAD_DIR
            );


            // =================================================
            // GET ORIGINAL FILE NAME
            // =================================================

            String originalFilename =
                    image.getOriginalFilename();


            if (
                    originalFilename == null ||
                            originalFilename.isBlank()
            ) {

                originalFilename =
                        "banana-leaf.jpg";
            }


            /*
             * Remove directory information if present.
             *
             * Example:
             *
             * C:\images\Banana.jpg
             *
             * becomes:
             *
             * Banana.jpg
             */

            originalFilename =
                    Paths.get(
                                    originalFilename
                            )
                            .getFileName()
                            .toString();


            // =================================================
            // GET FILE EXTENSION
            // =================================================

            String extension = "";


            int dotIndex =
                    originalFilename
                            .lastIndexOf('.');


            if (
                    dotIndex >= 0 &&
                            dotIndex <
                                    originalFilename.length() - 1
            ) {

                extension =
                        originalFilename
                                .substring(
                                        dotIndex
                                )
                                .toLowerCase();
            }


            // =================================================
            // GENERATE UNIQUE FILE NAME
            // =================================================

            String uniqueFilename =
                    UUID.randomUUID()
                            .toString()
                            + extension;


            // =================================================
            // CREATE DESTINATION PATH
            // =================================================

            Path destination =
                    DIAGNOSIS_UPLOAD_DIR
                            .resolve(
                                    uniqueFilename
                            )
                            .normalize();


            // =================================================
            // SECURITY CHECK
            // =================================================

            if (
                    !destination.startsWith(
                            DIAGNOSIS_UPLOAD_DIR
                    )
            ) {

                throw new IllegalArgumentException(
                        "Invalid image filename"
                );
            }


            // =================================================
            // SAVE IMAGE
            // =================================================

            Files.copy(
                    image.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );


            // =================================================
            // CREATE RELATIVE IMAGE PATH
            // =================================================



            storedImagePath =
                    Paths.get(
                                    "uploads",
                                    "diagnoses",
                                    uniqueFilename
                            )
                            .toString()
                            .replace(
                                    "\\",
                                    "/"
                            );


            // =================================================
            // CREATE DIAGNOSIS ENTITY
            // =================================================

            Diagnosis diagnosis =
                    new Diagnosis();


            diagnosis.setPlantation(
                    plantation
            );


            diagnosis.setImageName(
                    originalFilename
            );


            diagnosis.setImagePath(
                    storedImagePath
            );


            diagnosis.setPredictedDisease(
                    aiResponse.getPredictedClass()
            );


            diagnosis.setConfidence(
                    aiResponse.getConfidence()
            );


            diagnosis.setConfidencePercentage(
                    aiResponse.getConfidencePercentage()
            );


            // =================================================
            // SAVE TO MYSQL
            // =================================================

            Diagnosis savedDiagnosis =
                    diagnosisRepository.save(
                            diagnosis
                    );


            // =================================================
            // RETURN RESPONSE
            // =================================================

            return mapToResponse(
                    savedDiagnosis
            );


        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Failed to save banana leaf image",
                    exception
            );


        } catch (RuntimeException exception) {

            /*
             * If the image was successfully stored but
             * something failed afterwards (for example,
             * database insert), remove the orphaned image.
             */

            deleteStoredImageQuietly(
                    storedImagePath
            );

            throw exception;
        }
    }


    // =====================================================
    // GET DIAGNOSIS HISTORY
    // =====================================================

    @Transactional(readOnly = true)
    public List<DiagnosisResponse> getDiagnosisHistory(
            Long plantationId,
            String userEmail
    ) {

        // -------------------------------------------------
        // Find plantation
        // -------------------------------------------------

        Plantation plantation =
                plantationRepository
                        .findById(
                                plantationId
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Plantation not found"
                                        )
                        );


        // -------------------------------------------------
        // Verify plantation ownership
        // -------------------------------------------------

        String plantationOwnerEmail =
                plantation
                        .getFarm()
                        .getUser()
                        .getEmail();


        if (
                plantationOwnerEmail == null ||
                        userEmail == null ||
                        !plantationOwnerEmail.equalsIgnoreCase(
                                userEmail
                        )
        ) {

            throw new SecurityException(
                    "You are not authorised to access this plantation"
            );
        }


        // -------------------------------------------------
        // Get diagnosis history
        // -------------------------------------------------

        return diagnosisRepository
                .findByPlantationIdOrderByDiagnosedAtDesc(
                        plantationId
                )
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }


    // =====================================================
    // ENTITY -> RESPONSE DTO
    // =====================================================

    private DiagnosisResponse mapToResponse(
            Diagnosis diagnosis
    ) {

        DiagnosisResponse response =
                new DiagnosisResponse();


        // -------------------------------------------------
        // Diagnosis ID
        // -------------------------------------------------

        response.setId(
                diagnosis.getId()
        );


        // -------------------------------------------------
        // Plantation ID
        // -------------------------------------------------

        response.setPlantationId(
                diagnosis
                        .getPlantation()
                        .getId()
        );


        // -------------------------------------------------
        // Original image name
        // -------------------------------------------------

        response.setImageName(
                diagnosis.getImageName()
        );


        // -------------------------------------------------
        // Image path
        // -------------------------------------------------

        String imagePath =
                diagnosis.getImagePath();


        response.setImagePath(
                imagePath
        );


        // -------------------------------------------------
        // Create frontend-accessible image URL
        // -------------------------------------------------

        if (
                imagePath != null &&
                        !imagePath.isBlank()
        ) {

            String normalizedPath =
                    imagePath.replace(
                            "\\",
                            "/"
                    );


            if (
                    !normalizedPath.startsWith(
                            "/"
                    )
            ) {

                normalizedPath =
                        "/" + normalizedPath;
            }


            response.setImageUrl(
                    normalizedPath
            );

        } else {

            /*
             * Old diagnosis records created before
             * image storage was implemented.
             */

            response.setImageUrl(
                    null
            );
        }


        // -------------------------------------------------
        // AI predicted disease
        // -------------------------------------------------

        response.setPredictedDisease(
                diagnosis.getPredictedDisease()
        );


        // -------------------------------------------------
        // Disease details and recommendations
        // -------------------------------------------------

        response.setDiseaseInfo(
                diseaseRecommendationService
                        .getDiseaseInfo(
                                diagnosis.getPredictedDisease()
                        )
        );


        // -------------------------------------------------
        // Confidence
        // -------------------------------------------------

        response.setConfidence(
                diagnosis.getConfidence()
        );


        response.setConfidencePercentage(
                diagnosis.getConfidencePercentage()
        );


        // -------------------------------------------------
        // Diagnosis date/time
        // -------------------------------------------------

        response.setDiagnosedAt(
                diagnosis.getDiagnosedAt()
        );


        return response;
    }


    // =====================================================
    // DELETE IMAGE IF SOMETHING FAILS
    // =====================================================

    private void deleteStoredImageQuietly(
            String storedImagePath
    ) {

        if (
                storedImagePath == null ||
                        storedImagePath.isBlank()
        ) {

            return;
        }


        try {

            Path savedFile =
                    Paths.get(
                                    storedImagePath
                            )
                            .toAbsolutePath()
                            .normalize();


            /*
             * Extra safety:
             *
             * Only delete files that are actually inside
             * uploads/diagnoses.
             */

            if (
                    savedFile.startsWith(
                            DIAGNOSIS_UPLOAD_DIR
                    )
            ) {

                Files.deleteIfExists(
                        savedFile
                );
            }


        } catch (IOException ignored) {

            /*
             * We don't replace the original exception
             * just because cleanup failed.
             */

        }
    }
    // =====================================================
// GET PLANTATION DIAGNOSIS SUMMARY
// =====================================================

    @Transactional(readOnly = true)
    public DiagnosisSummaryResponse getDiagnosisSummary(
            Long plantationId,
            String userEmail
    ) {

        // Find plantation
        Plantation plantation =
                plantationRepository
                        .findById(plantationId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Plantation not found"
                                )
                        );

        // Verify plantation ownership
        String plantationOwnerEmail =
                plantation
                        .getFarm()
                        .getUser()
                        .getEmail();

        if (
                plantationOwnerEmail == null ||
                        userEmail == null ||
                        !plantationOwnerEmail.equalsIgnoreCase(userEmail)
        ) {

            throw new SecurityException(
                    "You are not authorised to access this plantation"
            );
        }

        // Get all diagnoses for plantation
        List<Diagnosis> diagnoses =
                diagnosisRepository
                        .findByPlantationIdOrderByDiagnosedAtDesc(
                                plantationId
                        );

        long totalDiagnoses =
                diagnoses.size();

        long healthyCount =
                diagnoses.stream()
                        .filter(diagnosis ->
                                "healthy".equalsIgnoreCase(
                                        diagnosis.getPredictedDisease()
                                )
                        )
                        .count();

        long cordanaCount =
                diagnoses.stream()
                        .filter(diagnosis ->
                                "cordana".equalsIgnoreCase(
                                        diagnosis.getPredictedDisease()
                                )
                        )
                        .count();

        long pestalotiopsisCount =
                diagnoses.stream()
                        .filter(diagnosis ->
                                "pestalotiopsis".equalsIgnoreCase(
                                        diagnosis.getPredictedDisease()
                                )
                        )
                        .count();

        long sigatokaCount =
                diagnoses.stream()
                        .filter(diagnosis ->
                                "sigatoka".equalsIgnoreCase(
                                        diagnosis.getPredictedDisease()
                                )
                        )
                        .count();

        long diseasedCount =
                totalDiagnoses - healthyCount;


        // =================================================
        // CALCULATE PERCENTAGES
        // =================================================

        double healthyPercentage = 0.0;
        double diseasedPercentage = 0.0;

        if (totalDiagnoses > 0) {

            healthyPercentage =
                    ((double) healthyCount / totalDiagnoses)
                            * 100;

            diseasedPercentage =
                    ((double) diseasedCount / totalDiagnoses)
                            * 100;
        }

        // Round to 2 decimal places
        healthyPercentage =
                Math.round(healthyPercentage * 100.0)
                        / 100.0;

        diseasedPercentage =
                Math.round(diseasedPercentage * 100.0)
                        / 100.0;


        // =================================================
        // DETERMINE PLANTATION HEALTH STATUS
        // =================================================

        String plantationHealthStatus;

        if (totalDiagnoses == 0) {

            plantationHealthStatus =
                    "NO_DATA";

        } else if (diseasedPercentage == 0) {

            plantationHealthStatus =
                    "HEALTHY";

        } else if (diseasedPercentage <= 30) {

            plantationHealthStatus =
                    "GOOD";

        } else if (diseasedPercentage <= 60) {

            plantationHealthStatus =
                    "MONITOR";

        } else {

            plantationHealthStatus =
                    "ATTENTION_REQUIRED";
        }


        // =================================================
        // GET LATEST DIAGNOSIS
        // =================================================

        DiagnosisResponse latestDiagnosis =
                null;

        if (!diagnoses.isEmpty()) {

            latestDiagnosis =
                    mapToResponse(
                            diagnoses.get(0)
                    );
        }


        // =================================================
        // BUILD RESPONSE
        // =================================================

        DiagnosisSummaryResponse response =
                new DiagnosisSummaryResponse();

        response.setPlantationId(
                plantationId
        );

        response.setTotalDiagnoses(
                totalDiagnoses
        );

        response.setHealthyCount(
                healthyCount
        );

        response.setCordanaCount(
                cordanaCount
        );

        response.setPestalotiopsisCount(
                pestalotiopsisCount
        );

        response.setSigatokaCount(
                sigatokaCount
        );

        response.setDiseasedCount(
                diseasedCount
        );

        response.setHealthyPercentage(
                healthyPercentage
        );

        response.setDiseasedPercentage(
                diseasedPercentage
        );

        response.setPlantationHealthStatus(
                plantationHealthStatus
        );

        response.setLatestDiagnosis(
                latestDiagnosis
        );

        return response;
    }
}