package com.bananacare.service;

import com.bananacare.dto.DiseaseInfoResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class DiseaseRecommendationService {

    public DiseaseInfoResponse getDiseaseInfo(
            String predictedDisease
    ) {

        if (predictedDisease == null ||
                predictedDisease.isBlank()) {

            return unknownDisease();
        }

        String disease =
                predictedDisease
                        .trim()
                        .toLowerCase(Locale.ROOT);

        return switch (disease) {

            case "cordana" -> cordana();

            case "sigatoka" -> sigatoka();

            case "pestalotiopsis" -> pestalotiopsis();

            case "healthy" -> healthy();

            default -> unknownDisease();
        };
    }


    // =====================================================
    // CORDANA
    // =====================================================

    private DiseaseInfoResponse cordana() {

        return new DiseaseInfoResponse(

                "cordana",

                "Cordana Leaf Spot",

                "MODERATE",

                "Cordana leaf spot is a fungal leaf disease "
                        + "that can cause brown lesions and "
                        + "damage banana leaf tissue.",

                List.of(
                        "Brown or oval spots on leaves",
                        "Yellowing around affected areas",
                        "Dry or damaged leaf tissue",
                        "Spots may enlarge as infection progresses"
                ),

                List.of(
                        "Remove heavily affected leaves where appropriate",
                        "Keep the plantation clean and remove infected plant debris",
                        "Avoid unnecessary prolonged leaf wetness",
                        "Improve airflow around banana plants",
                        "Monitor nearby plants for similar symptoms",
                        "Consult a local agricultural expert before applying fungicides"
                )
        );
    }


    // =====================================================
    // SIGATOKA
    // =====================================================

    private DiseaseInfoResponse sigatoka() {

        return new DiseaseInfoResponse(

                "sigatoka",

                "Sigatoka Leaf Spot",

                "HIGH",

                "Sigatoka is an important fungal leaf-spot "
                        + "disease of banana that can reduce "
                        + "healthy leaf area and affect plant productivity.",

                List.of(
                        "Small streaks or spots on banana leaves",
                        "Dark brown or black leaf lesions",
                        "Yellowing of affected leaf areas",
                        "Progressive drying of leaf tissue"
                ),

                List.of(
                        "Regularly inspect the plantation for affected leaves",
                        "Remove severely affected leaf material where appropriate",
                        "Maintain good field sanitation",
                        "Improve drainage and airflow where possible",
                        "Avoid practices that unnecessarily increase leaf wetness",
                        "Seek local agricultural guidance for disease-management options"
                )
        );
    }


    // =====================================================
    // PESTALOTIOPSIS
    // =====================================================

    private DiseaseInfoResponse pestalotiopsis() {

        return new DiseaseInfoResponse(

                "pestalotiopsis",

                "Pestalotiopsis Leaf Spot",

                "MODERATE",

                "Pestalotiopsis-associated leaf spot can "
                        + "produce necrotic lesions and damage "
                        + "banana leaf tissue.",

                List.of(
                        "Brown or grey leaf spots",
                        "Dry necrotic areas",
                        "Discolouration around affected tissue",
                        "Expansion of lesions under favourable conditions"
                ),

                List.of(
                        "Remove severely damaged leaf material where appropriate",
                        "Dispose of infected plant debris responsibly",
                        "Maintain good plantation sanitation",
                        "Reduce prolonged moisture on foliage where practical",
                        "Monitor neighbouring plants for developing symptoms",
                        "Consult an agricultural professional if the disease continues to spread"
                )
        );
    }


    // =====================================================
    // HEALTHY
    // =====================================================

    private DiseaseInfoResponse healthy() {

        return new DiseaseInfoResponse(

                "healthy",

                "Healthy Banana Leaf",

                "NONE",

                "The AI model did not detect one of the "
                        + "supported banana leaf diseases in this image.",

                List.of(
                        "No supported disease pattern detected"
                ),

                List.of(
                        "Continue regular plantation monitoring",
                        "Maintain appropriate irrigation and drainage",
                        "Maintain good plantation hygiene",
                        "Inspect plants periodically for new symptoms",
                        "Upload another clear leaf image if suspicious symptoms appear"
                )
        );
    }


    // =====================================================
    // UNKNOWN
    // =====================================================

    private DiseaseInfoResponse unknownDisease() {

        return new DiseaseInfoResponse(

                "unknown",

                "Unknown Result",

                "UNKNOWN",

                "No disease information is available for "
                        + "this prediction.",

                List.of(
                        "Unable to determine symptoms"
                ),

                List.of(
                        "Capture a clear image of the banana leaf",
                        "Ensure the leaf is well lit and in focus",
                        "Try the diagnosis again",
                        "Consult an agricultural expert if symptoms persist"
                )
        );
    }
}