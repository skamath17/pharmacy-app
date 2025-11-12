package com.pharmacy.order.service;

import com.pharmacy.common.exception.PharmacyException;
import com.pharmacy.order.dto.*;
import com.pharmacy.order.model.Order;
import com.pharmacy.order.model.OrderItem;
import com.pharmacy.order.repository.OrderItemRepository;
import com.pharmacy.order.repository.OrderRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    /**
     * Get patient ID from user ID
     */
    private UUID getPatientIdFromUserId(UUID userId) {
        try {
            String sql = "SELECT id FROM patients WHERE user_id = :userId";
            UUID patientId = (UUID) entityManager.createNativeQuery(sql)
                    .setParameter("userId", userId)
                    .getSingleResult();
            return patientId;
        } catch (jakarta.persistence.NoResultException e) {
            throw new PharmacyException("Patient profile not found for user", HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Generate unique order number: ORD-YYYYMMDD-XXX
     */
    private String generateOrderNumber() {
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Get count of orders created today
        String sql = "SELECT COUNT(*) FROM orders WHERE order_number LIKE :pattern";
        Long count = ((Number) entityManager.createNativeQuery(sql)
                .setParameter("pattern", "ORD-" + datePrefix + "-%")
                .getSingleResult()).longValue();
        
        String sequence = String.format("%03d", count + 1);
        return "ORD-" + datePrefix + "-" + sequence;
    }
    
    /**
     * Get cart data using native SQL (since cart-service is separate)
     */
    private CartData getCartData(UUID patientId) {
        // Get cart
        String cartSql = "SELECT id FROM carts WHERE patient_id = :patientId";
        UUID cartId;
        try {
            cartId = (UUID) entityManager.createNativeQuery(cartSql)
                    .setParameter("patientId", patientId)
                    .getSingleResult();
        } catch (jakarta.persistence.NoResultException e) {
            throw new PharmacyException("Cart is empty", HttpStatus.BAD_REQUEST);
        }
        
        // Get cart items with medicine info
        String itemsSql = """
            SELECT 
                ci.id,
                ci.medicine_id,
                ci.quantity,
                ci.unit_price,
                ci.discount_percentage,
                m.name as medicine_name,
                m.image_url as medicine_image_url
            FROM cart_items ci
            JOIN medicines m ON ci.medicine_id = m.id
            WHERE ci.cart_id = :cartId
            """;
        
        @SuppressWarnings("unchecked")
        List<Object[]> results = entityManager.createNativeQuery(itemsSql)
                .setParameter("cartId", cartId)
                .getResultList();
        
        if (results.isEmpty()) {
            throw new PharmacyException("Cart is empty", HttpStatus.BAD_REQUEST);
        }
        
        List<CartItemData> items = results.stream()
                .map(row -> new CartItemData(
                        (UUID) row[0],
                        (UUID) row[1],
                        ((Number) row[2]).intValue(),
                        new BigDecimal(row[3].toString()),
                        new BigDecimal(row[4].toString()),
                        (String) row[5],
                        (String) row[6]
                ))
                .collect(Collectors.toList());
        
        // Calculate totals
        BigDecimal subtotal = items.stream()
                .map(item -> item.unitPrice.multiply(BigDecimal.valueOf(item.quantity)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalDiscount = items.stream()
                .map(item -> {
                    BigDecimal itemTotal = item.unitPrice.multiply(BigDecimal.valueOf(item.quantity));
                    return itemTotal.multiply(item.discountPercentage).divide(BigDecimal.valueOf(100));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal total = subtotal.subtract(totalDiscount);
        
        return new CartData(cartId, items, subtotal, totalDiscount, total);
    }
    
    /**
     * Clear cart after order creation
     */
    private void clearCart(UUID cartId) {
        // Delete cart items
        String deleteItemsSql = "DELETE FROM cart_items WHERE cart_id = :cartId";
        entityManager.createNativeQuery(deleteItemsSql)
                .setParameter("cartId", cartId)
                .executeUpdate();
        
        // Delete cart
        String deleteCartSql = "DELETE FROM carts WHERE id = :cartId";
        entityManager.createNativeQuery(deleteCartSql)
                .setParameter("cartId", cartId)
                .executeUpdate();
    }
    
    @Transactional
    public OrderDto createOrderFromCart(UUID userId, CreateOrderRequest request) {
        UUID patientId = getPatientIdFromUserId(userId);
        
        // Get cart data
        CartData cartData = getCartData(patientId);
        
        if (cartData.items().isEmpty()) {
            throw new PharmacyException("Cart is empty", HttpStatus.BAD_REQUEST);
        }
        
        // Generate order number
        String orderNumber = generateOrderNumber();
        
        // Create order
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setPatientId(patientId);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setSubtotal(cartData.subtotal());
        order.setDiscountAmount(cartData.totalDiscount());
        order.setTaxAmount(BigDecimal.ZERO); // Will be calculated later
        order.setShippingCharges(BigDecimal.ZERO); // Will be calculated later
        order.setTotalAmount(cartData.total());
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());
        
        order = orderRepository.save(order);
        
        // Create order items
        List<OrderItem> savedItems = new java.util.ArrayList<>();
        for (CartItemData cartItem : cartData.items()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMedicineId(cartItem.medicineId());
            orderItem.setQuantity(cartItem.quantity());
            orderItem.setUnitPrice(cartItem.unitPrice());
            orderItem.setDiscountPercentage(cartItem.discountPercentage());
            
            // Calculate total price
            BigDecimal itemTotal = cartItem.unitPrice().multiply(BigDecimal.valueOf(cartItem.quantity()));
            BigDecimal itemDiscount = itemTotal.multiply(cartItem.discountPercentage())
                    .divide(BigDecimal.valueOf(100));
            orderItem.setTotalPrice(itemTotal.subtract(itemDiscount));
            
            OrderItem savedItem = orderItemRepository.save(orderItem);
            savedItems.add(savedItem);
        }
        
        // Set items on order for DTO conversion
        order.setItems(savedItems);
        
        // Clear cart
        clearCart(cartData.cartId());
        
        log.info("Order created: {} for patient: {}", orderNumber, patientId);
        
        // Convert to DTO directly - we already have all the data
        return convertToDto(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderDto> getPatientOrders(UUID userId) {
        UUID patientId = getPatientIdFromUserId(userId);
        List<Order> orders = orderRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public OrderDto getOrderById(UUID userId, UUID orderId) {
        UUID patientId = getPatientIdFromUserId(userId);
        log.info("Getting order {} for patient {}", orderId, patientId);
        
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> {
                    log.error("Order not found: {}", orderId);
                    return new PharmacyException("Order not found", HttpStatus.NOT_FOUND);
                });
        
        log.info("Order found: {}, belongs to patient: {}, requesting patient: {}", 
                orderId, order.getPatientId(), patientId);
        
        if (!order.getPatientId().equals(patientId)) {
            log.error("Order {} does not belong to patient {}. Order belongs to: {}", 
                    orderId, patientId, order.getPatientId());
            throw new PharmacyException("Order does not belong to this patient", HttpStatus.FORBIDDEN);
        }
        
        return convertToDto(order);
    }
    
    private OrderDto convertToDto(Order order) {
        // Get order items - handle null collection
        List<OrderItem> orderItems = order.getItems();
        if (orderItems == null || orderItems.isEmpty()) {
            // If items are not loaded, fetch them separately
            orderItems = orderItemRepository.findByOrderId(order.getId());
        }
        
        // Get medicine info for order items
        List<OrderItemDto> itemDtos = orderItems.stream()
                .map(item -> {
                    // Get medicine name and image
                    String sql = "SELECT name, image_url FROM medicines WHERE id = :medicineId";
                    Object[] result = (Object[]) entityManager.createNativeQuery(sql)
                            .setParameter("medicineId", item.getMedicineId())
                            .getSingleResult();
                    
                    return OrderItemDto.builder()
                            .id(item.getId())
                            .medicineId(item.getMedicineId())
                            .medicineName((String) result[0])
                            .medicineImageUrl((String) result[1])
                            .inventoryId(item.getInventoryId())
                            .prescriptionItemId(item.getPrescriptionItemId())
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .discountPercentage(item.getDiscountPercentage())
                            .totalPrice(item.getTotalPrice())
                            .createdAt(item.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
        
        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .patientId(order.getPatientId())
                .prescriptionId(order.getPrescriptionId())
                .status(order.getStatus().name())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .taxAmount(order.getTaxAmount())
                .shippingCharges(order.getShippingCharges())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus().name())
                .paymentMethod(order.getPaymentMethod())
                .paymentTransactionId(order.getPaymentTransactionId())
                .shippingAddress(order.getShippingAddress())
                .verifiedBy(order.getVerifiedBy())
                .verifiedAt(order.getVerifiedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .trackingNumber(order.getTrackingNumber())
                .courierName(order.getCourierName())
                .items(itemDtos)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
    
    // Helper records for cart data
    private record CartData(
            UUID cartId,
            List<CartItemData> items,
            BigDecimal subtotal,
            BigDecimal totalDiscount,
            BigDecimal total
    ) {}
    
    private record CartItemData(
            UUID id,
            UUID medicineId,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal discountPercentage,
            String medicineName,
            String medicineImageUrl
    ) {}
}

