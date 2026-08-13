package com.bananacare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseDetectionResponse {

    private Long id;

    private Long plantationId;

    private String plantationName;

    private String imageUrl;

    private String detectedDisease;

    private Double confidenceScore;

    private String detectionStatus;

    private String recommendation;

    private LocalDateTime detectedAt;
}