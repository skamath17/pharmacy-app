package com.pharmacy.cart.controller;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.cart.dto.*;
import com.pharmacy.cart.service.CartService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
public class CartController {
    
    private final CartService cartService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(@RequestHeader("X-User-Id") UUID userId) {
        log.info("Get cart request for user: {}", userId);
        UUID patientId = getPatientIdFromUserId(userId);
        CartDto cart = cartService.getCart(patientId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }
    
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody AddToCartRequest request) {
        log.info("Add to cart request for user: {}, medicineId: {}, quantity: {}", 
                userId, request.getMedicineId(), request.getQuantity());
        UUID patientId = getPatientIdFromUserId(userId);
        CartDto cart = cartService.addToCart(patientId, request);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable(name = "itemId") UUID itemId,
            @RequestBody UpdateCartItemRequest request) {
        log.info("Update cart item request for user: {}, itemId: {}, quantity: {}", 
                userId, itemId, request.getQuantity());
        UUID patientId = getPatientIdFromUserId(userId);
        CartDto cart = cartService.updateCartItem(patientId, itemId, request);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeFromCart(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable(name = "itemId") UUID itemId) {
        log.info("Remove from cart request for user: {}, itemId: {}", userId, itemId);
        UUID patientId = getPatientIdFromUserId(userId);
        CartDto cart = cartService.removeFromCart(patientId, itemId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }
    
    @DeleteMapping
    public ResponseEntity<ApiResponse<Object>> clearCart(@RequestHeader("X-User-Id") UUID userId) {
        log.info("Clear cart request for user: {}", userId);
        UUID patientId = getPatientIdFromUserId(userId);
        cartService.clearCart(patientId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully", null));
    }
    
    private UUID getPatientIdFromUserId(UUID userId) {
        try {
            String query = "SELECT p.id FROM patients p WHERE p.user_id = :userId";
            UUID patientId = (UUID) entityManager.createNativeQuery(query)
                    .setParameter("userId", userId)
                    .getSingleResult();
            return patientId;
        } catch (jakarta.persistence.NoResultException e) {
            throw new RuntimeException("Patient profile not found for user: " + userId);
        }
    }
}


