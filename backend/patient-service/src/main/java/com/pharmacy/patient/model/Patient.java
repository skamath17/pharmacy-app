package com.pharmacy.patient.model;

import com.pharmacy.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "patients")
public class Patient extends BaseEntity {
    
    @Column(name = "user_id", unique = true, nullable = false)
    private UUID userId;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @Column(name = "address_line1")
    private String addressLine1;
    
    @Column(name = "address_line2")
    private String addressLine2;
    
    private String city;
    
    private String state;
    
    @Column(name = "postal_code")
    private String postalCode;
    
    private String country = "India";
    
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;
    
    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;
    
    @Column(columnDefinition = "TEXT[]")
    private String[] allergies;
    
    @Column(name = "medical_conditions", columnDefinition = "TEXT[]")
    private String[] medicalConditions;
    
    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }
}


