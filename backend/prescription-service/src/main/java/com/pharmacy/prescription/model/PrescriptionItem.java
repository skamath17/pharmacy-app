package com.pharmacy.prescription.model;

import com.pharmacy.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "prescription_items")
public class PrescriptionItem extends BaseEntity {
    
    @Column(name = "prescription_id", nullable = false)
    private UUID prescriptionId;
    
    @Column(name = "medicine_id", nullable = false)
    private UUID medicineId;
    
    @Column(nullable = false)
    private Integer quantity;
    
    private String dosage;
    private String frequency;
    
    @Column(name = "duration_days")
    private Integer durationDays;
    
    @Column(columnDefinition = "TEXT")
    private String instructions;
    
    @Column(name = "substitution_allowed")
    private Boolean substitutionAllowed = true;
}


