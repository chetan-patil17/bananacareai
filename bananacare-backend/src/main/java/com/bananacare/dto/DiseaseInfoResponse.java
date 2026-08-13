package com.bananacare.dto;

import java.util.List;

public class DiseaseInfoResponse {

    private String diseaseName;
    private String displayName;
    private String severity;
    private String description;
    private List<String> symptoms;
    private List<String> recommendations;

    public DiseaseInfoResponse() {
    }

    public DiseaseInfoResponse(
            String diseaseName,
            String displayName,
            String severity,
            String description,
            List<String> symptoms,
            List<String> recommendations
    ) {
        this.diseaseName = diseaseName;
        this.displayName = displayName;
        this.severity = severity;
        this.description = description;
        this.symptoms = symptoms;
        this.recommendations = recommendations;
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(
            List<String> recommendations
    ) {
        this.recommendations = recommendations;
    }
}