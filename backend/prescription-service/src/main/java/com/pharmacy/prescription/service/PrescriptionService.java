package com.pharmacy.prescription.service;

import com.pharmacy.common.exception.PharmacyException;
import com.pharmacy.prescription.dto.PrescriptionDto;
import com.pharmacy.prescription.model.Prescription;
import com.pharmacy.prescription.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;
    private final EntityManager entityManager;
    
    @Value("${file.storage.path:./uploads/prescriptions}")
    private String storagePath;
    
    @Value("${file.storage.base-url:http://localhost:8083/api/prescriptions/files}")
    private String baseUrl;
    
    /**
     * Get patient ID from user ID by querying the patients table
     */
    private UUID getPatientIdFromUserId(UUID userId) {
        Query query = entityManager.createNativeQuery(
            "SELECT id FROM patients WHERE user_id = :userId"
        );
        query.setParameter("userId", userId);
        try {
            Object result = query.getSingleResult();
            return (UUID) result;
        } catch (jakarta.persistence.NoResultException e) {
            throw new PharmacyException("Patient profile not found. Please complete your profile first.", HttpStatus.NOT_FOUND);
        }
    }
    
    @Transactional
    public PrescriptionDto uploadPrescription(UUID userId, MultipartFile file) {
        try {
            // Get patient ID from user ID
            UUID patientId = getPatientIdFromUserId(userId);
            
            // Validate file
            if (file.isEmpty()) {
                throw new PharmacyException("File is empty", HttpStatus.BAD_REQUEST);
            }
            
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                throw new PharmacyException("Only image and PDF files are allowed", HttpStatus.BAD_REQUEST);
            }
            
            // Create storage directory if it doesn't exist
            Path uploadDir;
            if (Paths.get(storagePath).isAbsolute()) {
                uploadDir = Paths.get(storagePath);
            } else {
                // Relative path - resolve from current working directory
                Path basePath = Paths.get(System.getProperty("user.dir"));
                uploadDir = basePath.resolve(storagePath);
            }
            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                log.info("Created upload directory: {}", uploadDir);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : "";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadDir.resolve(filename);
            
            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create prescription record
            Prescription prescription = new Prescription();
            prescription.setPatientId(patientId);
            prescription.setPrescriptionType(Prescription.PrescriptionType.UPLOADED);
            prescription.setFileUrl(baseUrl + "/" + filename);
            prescription.setFileType(contentType);
            prescription.setStatus(Prescription.Status.PENDING);
            prescription.setExpiresAt(LocalDateTime.now().plusMonths(6)); // 6 months validity
            
            prescription = prescriptionRepository.save(prescription);
            log.info("Prescription uploaded: {} for patient: {} (user: {})", prescription.getId(), patientId, userId);
            
            return PrescriptionDto.fromEntity(prescription);
        } catch (IOException e) {
            log.error("Error uploading prescription file", e);
            throw new PharmacyException("Failed to upload prescription file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    public List<PrescriptionDto> getPatientPrescriptions(UUID userId) {
        UUID patientId = getPatientIdFromUserId(userId);
        List<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return prescriptions.stream()
                .map(PrescriptionDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public PrescriptionDto getPrescription(UUID prescriptionId, UUID userId) {
        UUID patientId = getPatientIdFromUserId(userId);
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new PharmacyException("Prescription not found", HttpStatus.NOT_FOUND));
        
        if (!prescription.getPatientId().equals(patientId)) {
            throw new PharmacyException("Access denied", HttpStatus.FORBIDDEN);
        }
        
        return PrescriptionDto.fromEntity(prescription);
    }
    
    @Transactional
    public void deletePrescription(UUID prescriptionId, UUID userId) {
        UUID patientId = getPatientIdFromUserId(userId);
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new PharmacyException("Prescription not found", HttpStatus.NOT_FOUND));
        
        if (!prescription.getPatientId().equals(patientId)) {
            throw new PharmacyException("Access denied", HttpStatus.FORBIDDEN);
        }
        
        // Delete file if exists
        if (prescription.getFileUrl() != null) {
            try {
                String filename = prescription.getFileUrl().substring(prescription.getFileUrl().lastIndexOf("/") + 1);
                
                Path filePath;
                if (Paths.get(storagePath).isAbsolute()) {
                    filePath = Paths.get(storagePath).resolve(filename);
                } else {
                    Path basePath = Paths.get(System.getProperty("user.dir"));
                    filePath = basePath.resolve(storagePath).resolve(filename);
                }
                
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                log.warn("Failed to delete prescription file: {}", prescription.getFileUrl(), e);
            }
        }
        
        prescriptionRepository.delete(prescription);
        log.info("Prescription deleted: {} for patient: {} (user: {})", prescriptionId, patientId, userId);
    }
}

