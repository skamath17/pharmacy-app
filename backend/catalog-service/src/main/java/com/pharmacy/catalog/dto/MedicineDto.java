package com.pharmacy.catalog.dto;

import com.pharmacy.catalog.model.Medicine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDto {
    private UUID id;
    private String name;
    private String genericName;
    private String manufacturer;
    private String strength;
    private Medicine.Form form;
    private Boolean prescriptionRequired;
    private Medicine.Schedule schedule;
    private String description;
    private String imageUrl;
    private Medicine.Status status;
    
    // Aggregated inventory data
    private Integer totalStock;
    private BigDecimal minPrice;
    private BigDecimal minMrp;
    private BigDecimal maxDiscount;
    private Boolean inStock;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


