package com.pharmacy.catalog.service;

import com.pharmacy.catalog.dto.MedicineDto;
import com.pharmacy.catalog.model.Medicine;
import com.pharmacy.catalog.model.MedicineInventory;
import com.pharmacy.catalog.repository.MedicineInventoryRepository;
import com.pharmacy.catalog.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogService {
    
    private final MedicineRepository medicineRepository;
    private final MedicineInventoryRepository inventoryRepository;
    
    @Transactional(readOnly = true)
    public List<MedicineDto> getAllMedicines() {
        List<Medicine> medicines = medicineRepository.findByStatus(Medicine.Status.ACTIVE);
        return medicines.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public MedicineDto getMedicineById(UUID id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found with id: " + id));
        return convertToDto(medicine);
    }
    
    @Transactional(readOnly = true)
    public List<MedicineDto> searchMedicines(String query) {
        List<Medicine> medicines = medicineRepository.searchActiveByNameOrGenericName(
                query, 
                Medicine.Status.ACTIVE
        );
        return medicines.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MedicineDto> filterMedicines(
            Medicine.Form form,
            Medicine.Schedule schedule,
            Boolean prescriptionRequired
    ) {
        List<Medicine> medicines = medicineRepository.findByStatus(Medicine.Status.ACTIVE);
        
        // Apply filters
        if (form != null) {
            medicines = medicines.stream()
                    .filter(m -> m.getForm() == form)
                    .collect(Collectors.toList());
        }
        
        if (schedule != null) {
            medicines = medicines.stream()
                    .filter(m -> m.getSchedule() == schedule)
                    .collect(Collectors.toList());
        }
        
        if (prescriptionRequired != null) {
            medicines = medicines.stream()
                    .filter(m -> m.getPrescriptionRequired().equals(prescriptionRequired))
                    .collect(Collectors.toList());
        }
        
        return medicines.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MedicineDto> searchAndFilterMedicines(
            String query,
            Medicine.Form form,
            Medicine.Schedule schedule,
            Boolean prescriptionRequired
    ) {
        List<Medicine> medicines;
        
        if (query != null && !query.trim().isEmpty()) {
            medicines = medicineRepository.searchActiveByNameOrGenericName(query, Medicine.Status.ACTIVE);
        } else {
            medicines = medicineRepository.findByStatus(Medicine.Status.ACTIVE);
        }
        
        // Apply filters
        if (form != null) {
            medicines = medicines.stream()
                    .filter(m -> m.getForm() == form)
                    .collect(Collectors.toList());
        }
        
        if (schedule != null) {
            medicines = medicines.stream()
                    .filter(m -> m.getSchedule() == schedule)
                    .collect(Collectors.toList());
        }
        
        if (prescriptionRequired != null) {
            medicines = medicines.stream()
                    .filter(m -> m.getPrescriptionRequired().equals(prescriptionRequired))
                    .collect(Collectors.toList());
        }
        
        return medicines.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private MedicineDto convertToDto(Medicine medicine) {
        UUID medicineId = medicine.getId();
        LocalDate currentDate = LocalDate.now();
        
        // Get aggregated inventory data
        Integer totalStock = inventoryRepository.getTotalAvailableQuantity(medicineId, currentDate);
        BigDecimal minPrice = inventoryRepository.getMinPrice(medicineId, currentDate);
        BigDecimal minMrp = inventoryRepository.getMinMrp(medicineId, currentDate);
        BigDecimal maxDiscount = inventoryRepository.getMaxDiscount(medicineId, currentDate);
        
        // Handle null values
        if (totalStock == null) totalStock = 0;
        if (minPrice == null) minPrice = BigDecimal.ZERO;
        if (minMrp == null) minMrp = BigDecimal.ZERO;
        if (maxDiscount == null) maxDiscount = BigDecimal.ZERO;
        
        return MedicineDto.builder()
                .id(medicine.getId())
                .name(medicine.getName())
                .genericName(medicine.getGenericName())
                .manufacturer(medicine.getManufacturer())
                .strength(medicine.getStrength())
                .form(medicine.getForm())
                .prescriptionRequired(medicine.getPrescriptionRequired())
                .schedule(medicine.getSchedule())
                .description(medicine.getDescription())
                .imageUrl(medicine.getImageUrl())
                .status(medicine.getStatus())
                .totalStock(totalStock)
                .minPrice(minPrice)
                .minMrp(minMrp)
                .maxDiscount(maxDiscount)
                .inStock(totalStock > 0)
                .createdAt(medicine.getCreatedAt())
                .updatedAt(medicine.getUpdatedAt())
                .build();
    }
}


