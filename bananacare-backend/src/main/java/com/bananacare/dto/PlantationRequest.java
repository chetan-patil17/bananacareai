package com.bananacare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PlantationRequest {

    @NotNull(message = "Farm ID is required")
    private Long farmId;

    @NotBlank(message = "Plantation name is required")
    private String plantationName;

    @NotBlank(message = "Banana variety is required")
    private String bananaVariety;

    @NotNull(message = "Plantation date is required")
    private LocalDate plantationDate;

    @NotNull(message = "Number of plants is required")
    @Positive(message = "Number of plants must be greater than zero")
    private Integer numberOfPlants;

    @Positive(message = "Row spacing must be greater than zero")
    private Double rowSpacing;

    @Positive(message = "Plant spacing must be greater than zero")
    private Double plantSpacing;
}