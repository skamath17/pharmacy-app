package com.pharmacy.order.dto;

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
public class OrderDto {
    private UUID id;
    private String orderNumber;
    private UUID patientId;
    private UUID prescriptionId;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal shippingCharges;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String paymentMethod;
    private String paymentTransactionId;
    private String shippingAddress; // JSON string
    private UUID verifiedBy;
    private LocalDateTime verifiedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private String trackingNumber;
    private String courierName;
    private List<OrderItemDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


