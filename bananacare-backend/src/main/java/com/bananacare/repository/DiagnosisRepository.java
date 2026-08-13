package com.bananacare.repository;

import com.bananacare.entity.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosisRepository
        extends JpaRepository<Diagnosis, Long> {

    List<Diagnosis> findByPlantationIdOrderByDiagnosedAtDesc(
            Long plantationId
    );
}