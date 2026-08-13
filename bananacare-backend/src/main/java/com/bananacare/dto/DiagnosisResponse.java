package com.bananacare.dto;

import java.time.LocalDateTime;

public class DiagnosisResponse {

    private Long id;
    private Long plantationId;

    private String imageName;
    private String imagePath;
    private String imageUrl;

    private String predictedDisease;
    private Double confidence;
    private Double confidencePercentage;

    private LocalDateTime diagnosedAt;

    // Disease information + recommendations
    private DiseaseInfoResponse diseaseInfo;

    public DiagnosisResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlantationId() {
        return plantationId;
    }

    public void setPlantationId(Long plantationId) {
        this.plantationId = plantationId;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPredictedDisease() {
        return predictedDisease;
    }

    public void setPredictedDisease(String predictedDisease) {
        this.predictedDisease = predictedDisease;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public Double getConfidencePercentage() {
        return confidencePercentage;
    }

    public void setConfidencePercentage(
            Double confidencePercentage
    ) {
        this.confidencePercentage = confidencePercentage;
    }

    public LocalDateTime getDiagnosedAt() {
        return diagnosedAt;
    }

    public void setDiagnosedAt(LocalDateTime diagnosedAt) {
        this.diagnosedAt = diagnosedAt;
    }

    public DiseaseInfoResponse getDiseaseInfo() {
        return diseaseInfo;
    }

    public void setDiseaseInfo(
            DiseaseInfoResponse diseaseInfo
    ) {
        this.diseaseInfo = diseaseInfo;
    }
}