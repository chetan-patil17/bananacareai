package com.bananacare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantationResponse {

    private Long id;

    private Long farmId;

    private String farmName;

    private String plantationName;

    private String bananaVariety;

    private LocalDate plantationDate;

    private Integer numberOfPlants;

    private Double rowSpacing;

    private Double plantSpacing;

    private String growthStage;

    private LocalDate expectedHarvestDate;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}