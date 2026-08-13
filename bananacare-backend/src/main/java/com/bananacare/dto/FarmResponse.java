package com.bananacare.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FarmResponse {

    private Long id;

    private String farmName;

    private String state;

    private String district;

    private String village;

    private Double area;

    private String areaUnit;

    private String soilType;

    private Double soilPh;

    private String waterSource;

    private String irrigationType;

    private Double latitude;

    private Double longitude;

    private LocalDateTime createdAt;
}