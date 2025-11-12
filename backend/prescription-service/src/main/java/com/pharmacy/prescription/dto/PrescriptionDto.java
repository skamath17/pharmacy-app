package com.pharmacy.prescription.dto;

import com.pharmacy.prescription.model.Prescription;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class PrescriptionDto {
    private UUID id;
    private UUID patientId;
    private Prescription.PrescriptionType prescriptionType;
    private String fileUrl;
    private String fileType;
    private Prescription.Status status;
    private UUID verifiedBy;
    private LocalDateTime verifiedAt;
    private String rejectionReason;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PrescriptionItemDto> items;
    
    public static PrescriptionDto fromEntity(Prescription prescription) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(prescription.getId());
        dto.setPatientId(prescription.getPatientId());
        dto.setPrescriptionType(prescription.getPrescriptionType());
        dto.setFileUrl(prescription.getFileUrl());
        dto.setFileType(prescription.getFileType());
        dto.setStatus(prescription.getStatus());
        dto.setVerifiedBy(prescription.getVerifiedBy());
        dto.setVerifiedAt(prescription.getVerifiedAt());
        dto.setRejectionReason(prescription.getRejectionReason());
        dto.setExpiresAt(prescription.getExpiresAt());
        dto.setCreatedAt(prescription.getCreatedAt());
        dto.setUpdatedAt(prescription.getUpdatedAt());
        return dto;
    }
}


