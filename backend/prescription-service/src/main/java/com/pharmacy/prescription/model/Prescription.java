package com.pharmacy.prescription.model;

import com.pharmacy.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "prescriptions")
public class Prescription extends BaseEntity {
    
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "prescription_type", nullable = false)
    private PrescriptionType prescriptionType;
    
    @Column(name = "file_url")
    private String fileUrl;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @Column(name = "verified_by")
    private UUID verifiedBy;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    public enum PrescriptionType {
        UPLOADED, ERX, MANUAL
    }
    
    public enum Status {
        PENDING, VERIFIED, REJECTED, EXPIRED
    }
}


