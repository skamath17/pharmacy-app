package com.pharmacy.patient.dto;

import com.pharmacy.patient.model.Patient;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class PatientDto {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Patient.Gender gender;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String[] allergies;
    private String[] medicalConditions;
    
    public static PatientDto fromEntity(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setUserId(patient.getUserId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setAddressLine1(patient.getAddressLine1());
        dto.setAddressLine2(patient.getAddressLine2());
        dto.setCity(patient.getCity());
        dto.setState(patient.getState());
        dto.setPostalCode(patient.getPostalCode());
        dto.setCountry(patient.getCountry());
        dto.setEmergencyContactName(patient.getEmergencyContactName());
        dto.setEmergencyContactPhone(patient.getEmergencyContactPhone());
        dto.setAllergies(patient.getAllergies());
        dto.setMedicalConditions(patient.getMedicalConditions());
        return dto;
    }
}


