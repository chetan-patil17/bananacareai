package com.bananacare.repository;

import com.bananacare.entity.DiseaseDetection;
import com.bananacare.entity.Plantation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DiseaseDetectionRepository
        extends JpaRepository<DiseaseDetection, Long> {

    // Get complete disease detection history of a plantation
    List<DiseaseDetection> findByPlantationOrderByDetectedAtDesc(
            Plantation plantation
    );

    // Get a particular detection belonging to a plantation
    Optional<DiseaseDetection> findByIdAndPlantation(
            Long id,
            Plantation plantation
    );
}