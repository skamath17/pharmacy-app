package com.pharmacy.catalog.repository;

import com.pharmacy.catalog.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, UUID> {
    
    List<Medicine> findByStatus(Medicine.Status status);
    
    @Query("SELECT m FROM Medicine m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.genericName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Medicine> searchByNameOrGenericName(@Param("query") String query);
    
    @Query("SELECT m FROM Medicine m WHERE " +
           "m.status = :status AND " +
           "(LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.genericName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Medicine> searchActiveByNameOrGenericName(@Param("query") String query, @Param("status") Medicine.Status status);
    
    List<Medicine> findByForm(Medicine.Form form);
    
    List<Medicine> findBySchedule(Medicine.Schedule schedule);
    
    List<Medicine> findByPrescriptionRequired(Boolean prescriptionRequired);
}


