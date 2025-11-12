package com.pharmacy.catalog.repository;

import com.pharmacy.catalog.model.MedicineInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MedicineInventoryRepository extends JpaRepository<MedicineInventory, UUID> {
    
    List<MedicineInventory> findByMedicineId(UUID medicineId);
    
    @Query("SELECT SUM(mi.quantityAvailable) FROM MedicineInventory mi WHERE mi.medicine.id = :medicineId AND mi.expiryDate > :currentDate")
    Integer getTotalAvailableQuantity(@Param("medicineId") UUID medicineId, @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT MIN(mi.unitPrice) FROM MedicineInventory mi WHERE mi.medicine.id = :medicineId AND mi.expiryDate > :currentDate AND mi.quantityAvailable > 0")
    java.math.BigDecimal getMinPrice(@Param("medicineId") UUID medicineId, @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT MIN(mi.mrp) FROM MedicineInventory mi WHERE mi.medicine.id = :medicineId AND mi.expiryDate > :currentDate AND mi.quantityAvailable > 0")
    java.math.BigDecimal getMinMrp(@Param("medicineId") UUID medicineId, @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT MAX(mi.discountPercentage) FROM MedicineInventory mi WHERE mi.medicine.id = :medicineId AND mi.expiryDate > :currentDate AND mi.quantityAvailable > 0")
    java.math.BigDecimal getMaxDiscount(@Param("medicineId") UUID medicineId, @Param("currentDate") LocalDate currentDate);
}


