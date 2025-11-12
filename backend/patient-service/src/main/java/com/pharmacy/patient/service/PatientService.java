package com.pharmacy.patient.service;

import com.pharmacy.common.exception.PharmacyException;
import com.pharmacy.patient.dto.CreatePatientRequest;
import com.pharmacy.patient.dto.PatientDto;
import com.pharmacy.patient.dto.UpdatePatientRequest;
import com.pharmacy.patient.model.Patient;
import com.pharmacy.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientService {
    
    private final PatientRepository patientRepository;
    
    @Transactional
    public PatientDto createPatient(UUID userId, CreatePatientRequest request) {
        if (patientRepository.existsByUserId(userId)) {
            throw new PharmacyException("Patient profile already exists for this user", HttpStatus.CONFLICT);
        }
        
        Patient patient = new Patient();
        patient.setUserId(userId);
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) {
            patient.setGender(Patient.Gender.valueOf(request.getGender().toUpperCase()));
        }
        patient.setAddressLine1(request.getAddressLine1());
        patient.setAddressLine2(request.getAddressLine2());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setPostalCode(request.getPostalCode());
        patient.setCountry(request.getCountry() != null ? request.getCountry() : "India");
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        patient.setAllergies(request.getAllergies());
        patient.setMedicalConditions(request.getMedicalConditions());
        
        patient = patientRepository.save(patient);
        log.info("Created patient profile for user: {}", userId);
        
        return PatientDto.fromEntity(patient);
    }
    
    public PatientDto getPatientByUserId(UUID userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new PharmacyException("Patient profile not found", HttpStatus.NOT_FOUND));
        return PatientDto.fromEntity(patient);
    }
    
    @Transactional
    public PatientDto updatePatient(UUID userId, UpdatePatientRequest request) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new PharmacyException("Patient profile not found", HttpStatus.NOT_FOUND));
        
        if (request.getFirstName() != null) patient.setFirstName(request.getFirstName());
        if (request.getLastName() != null) patient.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) {
            patient.setGender(Patient.Gender.valueOf(request.getGender().toUpperCase()));
        }
        if (request.getAddressLine1() != null) patient.setAddressLine1(request.getAddressLine1());
        if (request.getAddressLine2() != null) patient.setAddressLine2(request.getAddressLine2());
        if (request.getCity() != null) patient.setCity(request.getCity());
        if (request.getState() != null) patient.setState(request.getState());
        if (request.getPostalCode() != null) patient.setPostalCode(request.getPostalCode());
        if (request.getCountry() != null) patient.setCountry(request.getCountry());
        if (request.getEmergencyContactName() != null) patient.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null) patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getAllergies() != null) patient.setAllergies(request.getAllergies());
        if (request.getMedicalConditions() != null) patient.setMedicalConditions(request.getMedicalConditions());
        
        patient = patientRepository.save(patient);
        log.info("Updated patient profile for user: {}", userId);
        
        return PatientDto.fromEntity(patient);
    }
}


