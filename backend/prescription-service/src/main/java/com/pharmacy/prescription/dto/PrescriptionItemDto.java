package com.pharmacy.prescription.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PrescriptionItemDto {
    private UUID id;
    private UUID prescriptionId;
    private UUID medicineId;
    private Integer quantity;
    private String dosage;
    private String frequency;
    private Integer durationDays;
    private String instructions;
    private Boolean substitutionAllowed;
}


