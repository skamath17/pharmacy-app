package com.pharmacy.patient.controller;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.patient.dto.CreatePatientRequest;
import com.pharmacy.patient.dto.PatientDto;
import com.pharmacy.patient.dto.UpdatePatientRequest;
import com.pharmacy.patient.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
public class PatientController {
    
    private final PatientService patientService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<PatientDto>> createPatient(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreatePatientRequest request) {
        PatientDto patient = patientService.createPatient(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Patient profile created successfully", patient));
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PatientDto>> getMyProfile(@RequestHeader("X-User-Id") UUID userId) {
        PatientDto patient = patientService.getPatientByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }
    
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<PatientDto>> updateMyProfile(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody UpdatePatientRequest request) {
        PatientDto patient = patientService.updatePatient(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Patient profile updated successfully", patient));
    }
}

