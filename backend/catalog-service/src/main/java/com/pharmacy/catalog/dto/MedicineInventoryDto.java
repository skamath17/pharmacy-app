package com.pharmacy.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineInventoryDto {
    private UUID id;
    private UUID medicineId;
    private String batchNumber;
    private LocalDate expiryDate;
    private Integer quantityAvailable;
    private BigDecimal unitPrice;
    private BigDecimal mrp;
    private BigDecimal discountPercentage;
    private String warehouseLocation;
}


