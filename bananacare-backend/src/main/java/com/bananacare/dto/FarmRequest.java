package com.bananacare.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmRequest {

    @NotBlank(message = "Farm name is required")
    private String farmName;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "District is required")
    private String district;

    private String village;

    @NotNull(message = "Farm area is required")
    @Positive(message = "Farm area must be greater than zero")
    private Double area;

    private String areaUnit;

    private String soilType;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "14.0")
    private Double soilPh;

    private String waterSource;

    private String irrigationType;

    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double latitude;

    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double longitude;
}