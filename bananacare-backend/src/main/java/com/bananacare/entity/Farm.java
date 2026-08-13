package com.bananacare.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "farms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_name", nullable = false)
    private String farmName;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    private String village;

    @Column(nullable = false)
    private Double area;

    @Column(name = "area_unit")
    private String areaUnit;

    @Column(name = "soil_type")
    private String soilType;

    @Column(name = "soil_ph")
    private Double soilPh;

    @Column(name = "water_source")
    private String waterSource;

    @Column(name = "irrigation_type")
    private String irrigationType;

    private Double latitude;

    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (areaUnit == null) {
            areaUnit = "ACRE";
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}