package com.bananacare.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "disease_detections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseDetection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Plantation whose leaf was analysed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plantation_id", nullable = false)
    private Plantation plantation;

    // Location/path of uploaded image
    @Column(name = "image_url")
    private String imageUrl;

    // Disease predicted by AI
    @Column(name = "detected_disease")
    private String detectedDisease;

    // AI confidence score
    @Column(name = "confidence_score")
    private Double confidenceScore;

    // HEALTHY / DISEASE_DETECTED / PENDING
    @Enumerated(EnumType.STRING)
    @Column(name = "detection_status", nullable = false)
    private DetectionStatus detectionStatus;

    // Future recommendation generated for farmer
    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(name = "detected_at")
    private LocalDateTime detectedAt;

    @PrePersist
    public void prePersist() {

        if (detectedAt == null) {
            detectedAt = LocalDateTime.now();
        }

        if (detectionStatus == null) {
            detectionStatus = DetectionStatus.PENDING;
        }
    }
}