package com.pharmacy.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private UUID id;
    private UUID patientId;
    private List<CartItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal totalDiscount;
    private BigDecimal total;
    private Integer itemCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


