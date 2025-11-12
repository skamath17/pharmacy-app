package com.pharmacy.prescription.repository;

import com.pharmacy.prescription.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
    List<Prescription> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    List<Prescription> findByStatus(Prescription.Status status);
    List<Prescription> findByPatientIdAndStatus(UUID patientId, Prescription.Status status);
}


