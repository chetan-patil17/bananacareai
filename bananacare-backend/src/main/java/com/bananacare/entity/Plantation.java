package com.bananacare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "plantations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plantation {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // PLANTATION DETAILS
    // =====================================================

    @Column(
            name = "plantation_name",
            nullable = false
    )
    private String plantationName;

    @Column(
            name = "banana_variety",
            nullable = false
    )
    private String bananaVariety;

    @Column(
            name = "plantation_date",
            nullable = false
    )
    private LocalDate plantationDate;

    @Column(
            name = "number_of_plants",
            nullable = false
    )
    private Integer numberOfPlants;


    // =====================================================
    // SPACING
    // =====================================================

    @Column(name = "row_spacing")
    private Double rowSpacing;

    @Column(name = "plant_spacing")
    private Double plantSpacing;


    // =====================================================
    // GROWTH INFORMATION
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "growth_stage",
            nullable = false
    )
    private GrowthStage growthStage;

    @Column(name = "expected_harvest_date")
    private LocalDate expectedHarvestDate;


    // =====================================================
    // STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false
    )
    private PlantationStatus status;


    // =====================================================
    // FARM RELATIONSHIP
    // =====================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "farm_id",
            nullable = false
    )
    private Farm farm;


    // =====================================================
    // TIMESTAMPS
    // =====================================================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;


    // =====================================================
    // BEFORE INSERT
    // =====================================================

    @PrePersist
    protected void prePersist() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (growthStage == null) {
            growthStage = GrowthStage.PLANTED;
        }

        if (status == null) {
            status = PlantationStatus.ACTIVE;
        }
    }


    // =====================================================
    // BEFORE UPDATE
    // =====================================================

    @PreUpdate
    protected void preUpdate() {

        updatedAt =
                LocalDateTime.now();
    }
}