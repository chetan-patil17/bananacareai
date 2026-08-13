package com.bananacare.controller;
import com.bananacare.dto.DiagnosisSummaryResponse;
import com.bananacare.dto.DiagnosisResponse;
import com.bananacare.service.DiagnosisService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/diagnoses")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    public DiagnosisController(
            DiagnosisService diagnosisService
    ) {
        this.diagnosisService = diagnosisService;
    }

    // =====================================================
    // CREATE DIAGNOSIS
    // =====================================================

    @PostMapping("/plantation/{plantationId}")
    public ResponseEntity<DiagnosisResponse> diagnose(
            @PathVariable Long plantationId,
            @RequestParam("image") MultipartFile image,
            Principal principal
    ) {

        DiagnosisResponse response =
                diagnosisService.diagnose(
                        plantationId,
                        image,
                        principal.getName()
                );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // GET DIAGNOSIS HISTORY
    // =====================================================

    @GetMapping("/plantation/{plantationId}")
    public ResponseEntity<List<DiagnosisResponse>>
    getDiagnosisHistory(
            @PathVariable Long plantationId,
            Principal principal
    ) {

        List<DiagnosisResponse> diagnoses =
                diagnosisService.getDiagnosisHistory(
                        plantationId,
                        principal.getName()
                );

        return ResponseEntity.ok(diagnoses);
    }
    // =====================================================
// GET PLANTATION DIAGNOSIS SUMMARY
// =====================================================

    @GetMapping("/plantation/{plantationId}/summary")
    public ResponseEntity<DiagnosisSummaryResponse> getDiagnosisSummary(
            @PathVariable Long plantationId,
            Principal principal
    ) {

        DiagnosisSummaryResponse summary =
                diagnosisService.getDiagnosisSummary(
                        plantationId,
                        principal.getName()
                );

        return ResponseEntity.ok(summary);
    }
}