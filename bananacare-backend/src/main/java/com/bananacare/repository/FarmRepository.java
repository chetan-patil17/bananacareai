package com.bananacare.repository;

import com.bananacare.entity.Farm;
import com.bananacare.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FarmRepository
        extends JpaRepository<Farm, Long> {

    List<Farm> findByUser(User user);

    Optional<Farm> findByIdAndUser(
            Long id,
            User user
    );
}