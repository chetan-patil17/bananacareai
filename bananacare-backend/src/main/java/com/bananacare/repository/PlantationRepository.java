package com.bananacare.repository;

import com.bananacare.entity.Farm;
import com.bananacare.entity.Plantation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlantationRepository
        extends JpaRepository<Plantation, Long> {

    // Get all plantations belonging to a farm
    List<Plantation> findByFarm(Farm farm);

    // Get a particular plantation only if it belongs to the farm
    Optional<Plantation> findByIdAndFarm(
            Long id,
            Farm farm
    );
}