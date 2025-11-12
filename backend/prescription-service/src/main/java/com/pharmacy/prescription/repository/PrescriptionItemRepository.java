package com.pharmacy.prescription.repository;

import com.pharmacy.prescription.model.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, UUID> {
    List<PrescriptionItem> findByPrescriptionId(UUID prescriptionId);
    void deleteByPrescriptionId(UUID prescriptionId);
}


