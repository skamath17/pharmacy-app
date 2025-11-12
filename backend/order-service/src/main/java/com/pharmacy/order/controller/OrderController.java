package com.pharmacy.order.controller;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.order.dto.CreateOrderRequest;
import com.pharmacy.order.dto.OrderDto;
import com.pharmacy.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${cors.allowed-origins}")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestBody CreateOrderRequest request
    ) {
        try {
            UUID userId = UUID.fromString(userIdHeader);
            log.info("Create order request for user: {}", userId);
            
            OrderDto order = orderService.createOrderFromCart(userId, request);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Order created successfully", order));
        } catch (Exception e) {
            log.error("Error creating order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create order: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(
            @RequestHeader("X-User-Id") String userIdHeader
    ) {
        try {
            UUID userId = UUID.fromString(userIdHeader);
            log.info("Get orders request for user: {}", userId);
            
            List<OrderDto> orders = orderService.getPatientOrders(userId);
            
            return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
        } catch (Exception e) {
            log.error("Error retrieving orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve orders: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrder(
            @RequestHeader("X-User-Id") String userIdHeader,
            @PathVariable(name = "orderId") UUID orderId
    ) {
        try {
            UUID userId = UUID.fromString(userIdHeader);
            log.info("Get order request for user: {}, orderId: {}", userId, orderId);
            
            OrderDto order = orderService.getOrderById(userId, orderId);
            
            return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
        } catch (Exception e) {
            log.error("Error retrieving order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve order: " + e.getMessage()));
        }
    }
}

