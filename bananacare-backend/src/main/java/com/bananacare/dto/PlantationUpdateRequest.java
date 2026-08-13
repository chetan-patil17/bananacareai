package com.bananacare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PlantationUpdateRequest {

    @NotBlank(message = "Plantation name is required")
    private String plantationName;

    @NotBlank(message = "Banana variety is required")
    private String bananaVariety;

    @Positive(message = "Number of plants must be greater than zero")
    private Integer numberOfPlants;

    @Positive(message = "Row spacing must be greater than zero")
    private Double rowSpacing;

    @Positive(message = "Plant spacing must be greater than zero")
    private Double plantSpacing;

    @NotBlank(message = "Growth stage is required")
    private String growthStage;

    private LocalDate expectedHarvestDate;

    @NotBlank(message = "Status is required")
    private String status;
}