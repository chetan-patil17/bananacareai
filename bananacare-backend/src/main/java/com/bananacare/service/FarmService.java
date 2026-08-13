package com.bananacare.service;

import com.bananacare.dto.FarmRequest;
import com.bananacare.dto.FarmResponse;

import com.bananacare.entity.Farm;
import com.bananacare.entity.User;

import com.bananacare.repository.FarmRepository;
import com.bananacare.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public FarmService(
            FarmRepository farmRepository,
            UserRepository userRepository
    ) {
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    public FarmResponse createFarm(
            FarmRequest request,
            String email
    ) {

        User user = getLoggedInUser(email);

        Farm farm = Farm.builder()
                .farmName(request.getFarmName())
                .state(request.getState())
                .district(request.getDistrict())
                .village(request.getVillage())
                .area(request.getArea())
                .areaUnit(request.getAreaUnit())
                .soilType(request.getSoilType())
                .soilPh(request.getSoilPh())
                .waterSource(request.getWaterSource())
                .irrigationType(request.getIrrigationType())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .user(user)
                .build();

        Farm savedFarm = farmRepository.save(farm);

        return mapToResponse(savedFarm);
    }

    public List<FarmResponse> getMyFarms(
            String email
    ) {

        User user = getLoggedInUser(email);

        return farmRepository
                .findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FarmResponse getFarm(
            Long farmId,
            String email
    ) {

        User user = getLoggedInUser(email);

        Farm farm = farmRepository
                .findByIdAndUser(farmId, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farm not found"
                        )
                );

        return mapToResponse(farm);
    }

    public FarmResponse updateFarm(
            Long farmId,
            FarmRequest request,
            String email
    ) {

        User user = getLoggedInUser(email);

        Farm farm = farmRepository
                .findByIdAndUser(farmId, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farm not found"
                        )
                );

        farm.setFarmName(request.getFarmName());
        farm.setState(request.getState());
        farm.setDistrict(request.getDistrict());
        farm.setVillage(request.getVillage());
        farm.setArea(request.getArea());
        farm.setAreaUnit(request.getAreaUnit());
        farm.setSoilType(request.getSoilType());
        farm.setSoilPh(request.getSoilPh());
        farm.setWaterSource(request.getWaterSource());
        farm.setIrrigationType(request.getIrrigationType());
        farm.setLatitude(request.getLatitude());
        farm.setLongitude(request.getLongitude());

        Farm updatedFarm =
                farmRepository.save(farm);

        return mapToResponse(updatedFarm);
    }

    public void deleteFarm(
            Long farmId,
            String email
    ) {

        User user = getLoggedInUser(email);

        Farm farm = farmRepository
                .findByIdAndUser(farmId, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farm not found"
                        )
                );

        farmRepository.delete(farm);
    }

    private FarmResponse mapToResponse(Farm farm) {

        return FarmResponse.builder()
                .id(farm.getId())
                .farmName(farm.getFarmName())
                .state(farm.getState())
                .district(farm.getDistrict())
                .village(farm.getVillage())
                .area(farm.getArea())
                .areaUnit(farm.getAreaUnit())
                .soilType(farm.getSoilType())
                .soilPh(farm.getSoilPh())
                .waterSource(farm.getWaterSource())
                .irrigationType(farm.getIrrigationType())
                .latitude(farm.getLatitude())
                .longitude(farm.getLongitude())
                .createdAt(farm.getCreatedAt())
                .build();
    }
}