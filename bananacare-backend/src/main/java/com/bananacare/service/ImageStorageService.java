package com.bananacare.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageStorageService {

    private static final String UPLOAD_DIRECTORY = "uploads/banana-leaves";

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of(
                    "image/jpeg",
                    "image/png"
            );

    public String storeImage(MultipartFile file) {

        // Check whether file exists
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please upload a banana leaf image"
            );
        }

        // Validate image type
        String contentType = file.getContentType();

        if (contentType == null ||
                !ALLOWED_CONTENT_TYPES.contains(contentType)) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG and PNG images are allowed"
            );
        }

        try {

            // Create upload directory if it doesn't exist
            Path uploadPath =
                    Paths.get(UPLOAD_DIRECTORY)
                            .toAbsolutePath()
                            .normalize();

            Files.createDirectories(uploadPath);

            // Determine safe extension
            String extension =
                    contentType.equals("image/png")
                            ? ".png"
                            : ".jpg";

            // Generate our own filename
            String fileName =
                    UUID.randomUUID() + extension;

            Path targetLocation =
                    uploadPath.resolve(fileName);

            // Store image
            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/uploads/banana-leaves/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store banana leaf image",
                    e
            );
        }
    }
}