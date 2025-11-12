package com.pharmacy.order.dto;

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
public class OrderItemDto {
    private UUID id;
    private UUID medicineId;
    private String medicineName;
    private String medicineImageUrl;
    private UUID inventoryId;
    private UUID prescriptionItemId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountPercentage;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}


