package com.bananacare.dto;

public class DiagnosisSummaryResponse {

    private Long plantationId;

    private long totalDiagnoses;

    private long healthyCount;

    private long cordanaCount;

    private long pestalotiopsisCount;

    private long sigatokaCount;

    private long diseasedCount;

    private double healthyPercentage;

    private double diseasedPercentage;

    private String plantationHealthStatus;

    private DiagnosisResponse latestDiagnosis;


    public DiagnosisSummaryResponse() {
    }


    public Long getPlantationId() {
        return plantationId;
    }

    public void setPlantationId(Long plantationId) {
        this.plantationId = plantationId;
    }


    public long getTotalDiagnoses() {
        return totalDiagnoses;
    }

    public void setTotalDiagnoses(long totalDiagnoses) {
        this.totalDiagnoses = totalDiagnoses;
    }


    public long getHealthyCount() {
        return healthyCount;
    }

    public void setHealthyCount(long healthyCount) {
        this.healthyCount = healthyCount;
    }


    public long getCordanaCount() {
        return cordanaCount;
    }

    public void setCordanaCount(long cordanaCount) {
        this.cordanaCount = cordanaCount;
    }


    public long getPestalotiopsisCount() {
        return pestalotiopsisCount;
    }

    public void setPestalotiopsisCount(long pestalotiopsisCount) {
        this.pestalotiopsisCount = pestalotiopsisCount;
    }


    public long getSigatokaCount() {
        return sigatokaCount;
    }

    public void setSigatokaCount(long sigatokaCount) {
        this.sigatokaCount = sigatokaCount;
    }


    public long getDiseasedCount() {
        return diseasedCount;
    }

    public void setDiseasedCount(long diseasedCount) {
        this.diseasedCount = diseasedCount;
    }


    public double getHealthyPercentage() {
        return healthyPercentage;
    }

    public void setHealthyPercentage(double healthyPercentage) {
        this.healthyPercentage = healthyPercentage;
    }


    public double getDiseasedPercentage() {
        return diseasedPercentage;
    }

    public void setDiseasedPercentage(double diseasedPercentage) {
        this.diseasedPercentage = diseasedPercentage;
    }


    public String getPlantationHealthStatus() {
        return plantationHealthStatus;
    }

    public void setPlantationHealthStatus(
            String plantationHealthStatus
    ) {
        this.plantationHealthStatus =
                plantationHealthStatus;
    }


    public DiagnosisResponse getLatestDiagnosis() {
        return latestDiagnosis;
    }

    public void setLatestDiagnosis(
            DiagnosisResponse latestDiagnosis
    ) {
        this.latestDiagnosis = latestDiagnosis;
    }
}