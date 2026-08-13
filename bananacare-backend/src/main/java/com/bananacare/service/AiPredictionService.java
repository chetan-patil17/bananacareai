package com.bananacare.service;

import com.bananacare.dto.AiPredictionResponse;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AiPredictionService {

    private final RestClient restClient;

    public AiPredictionService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("http://localhost:8000")
                .build();
    }

    public AiPredictionResponse predict(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException(
                    "Banana leaf image is required"
            );
        }

        try {

            ByteArrayResource imageResource =
                    new ByteArrayResource(image.getBytes()) {

                        @Override
                        public String getFilename() {
                            return image.getOriginalFilename();
                        }
                    };

            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();

            body.add("image", imageResource);

            AiPredictionResponse response =
                    restClient.post()
                            .uri("/predict")
                            .contentType(MediaType.MULTIPART_FORM_DATA)
                            .body(body)
                            .retrieve()
                            .body(AiPredictionResponse.class);

            if (response == null) {
                throw new IllegalStateException(
                        "AI service returned an empty response"
                );
            }

            return response;

        } catch (IOException e) {

            throw new IllegalStateException(
                    "Failed to read uploaded image",
                    e
            );
        }
    }
}