package com.bananacare.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "diagnoses")
public class Diagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "plantation_id",
            nullable = false
    )
    private Plantation plantation;

    @Column(
            name = "image_name",
            nullable = false
    )
    private String imageName;

    @Column(
            name = "image_path",
            nullable = false
    )
    private String imagePath;

    @Column(
            name = "predicted_disease",
            nullable = false
    )
    private String predictedDisease;

    @Column(
            name = "confidence",
            nullable = false
    )
    private Double confidence;

    @Column(
            name = "confidence_percentage",
            nullable = false
    )
    private Double confidencePercentage;

    @Column(
            name = "diagnosed_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime diagnosedAt;

    public Diagnosis() {
    }

    @PrePersist
    protected void onCreate() {
        diagnosedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Plantation getPlantation() {
        return plantation;
    }

    public void setPlantation(Plantation plantation) {
        this.plantation = plantation;
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
}