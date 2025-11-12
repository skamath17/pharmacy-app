package com.pharmacy.cart.service;

import com.pharmacy.cart.dto.*;
import com.pharmacy.cart.model.Cart;
import com.pharmacy.cart.model.CartItem;
import com.pharmacy.cart.repository.CartItemRepository;
import com.pharmacy.cart.repository.CartRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Transactional(readOnly = true)
    public CartDto getCart(UUID patientId) {
        Cart cart = getOrCreateCart(patientId);
        return convertToDto(cart);
    }
    
    @Transactional
    public CartDto addToCart(UUID patientId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(patientId);
        
        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndMedicineId(cart.getId(), request.getMedicineId());
        
        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            // Get medicine pricing from inventory
            MedicinePricing pricing = getMedicinePricing(request.getMedicineId());
            if (pricing == null) {
                throw new RuntimeException("Medicine not found or not available");
            }
            
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setMedicineId(request.getMedicineId());
            newItem.setQuantity(request.getQuantity());
            newItem.setUnitPrice(pricing.unitPrice);
            newItem.setDiscountPercentage(pricing.discountPercentage);
            
            cartItemRepository.save(newItem);
        }
        
        // Refresh the cart entity to get updated items
        entityManager.refresh(cart);
        
        // Reload cart with JOIN FETCH to get items
        cart = cartRepository.findByPatientId(patientId).orElseThrow();
        return convertToDto(cart);
    }
    
    @Transactional
    public CartDto updateCartItem(UUID patientId, UUID itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(patientId);
        
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }
        
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        
        // Refresh cart using JOIN FETCH query
        cart = cartRepository.findByPatientId(patientId).orElseThrow();
        return convertToDto(cart);
    }
    
    @Transactional
    public CartDto removeFromCart(UUID patientId, UUID itemId) {
        Cart cart = getOrCreateCart(patientId);
        
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }
        
        cartItemRepository.delete(item);
        
        // Refresh cart using JOIN FETCH query
        cart = cartRepository.findByPatientId(patientId).orElseThrow();
        return convertToDto(cart);
    }
    
    @Transactional
    public void clearCart(UUID patientId) {
        Cart cart = getOrCreateCart(patientId);
        cartItemRepository.deleteByCartId(cart.getId());
    }
    
    private Cart getOrCreateCart(UUID patientId) {
        Cart cart = cartRepository.findByPatientId(patientId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setPatientId(patientId);
                    return cartRepository.save(newCart);
                });
        
        return cart;
    }
    
    private MedicinePricing getMedicinePricing(UUID medicineId) {
        LocalDate currentDate = LocalDate.now();
        
        // Query medicine_inventory to get best pricing
        String query = """
            SELECT mi.unit_price, mi.discount_percentage, mi.quantity_available
            FROM medicine_inventory mi
            WHERE mi.medicine_id = :medicineId
            AND mi.expiry_date > :currentDate
            AND mi.quantity_available > 0
            ORDER BY mi.unit_price ASC
            LIMIT 1
            """;
        
        try {
            Object[] result = (Object[]) entityManager.createNativeQuery(query)
                    .setParameter("medicineId", medicineId)
                    .setParameter("currentDate", currentDate)
                    .getSingleResult();
            
            BigDecimal unitPrice = (BigDecimal) result[0];
            BigDecimal discountPercentage = (BigDecimal) result[1];
            Integer quantityAvailable = ((Number) result[2]).intValue();
            
            return new MedicinePricing(unitPrice, discountPercentage, quantityAvailable > 0);
        } catch (Exception e) {
            log.error("Error fetching medicine pricing for medicineId: {}", medicineId, e);
            return null;
        }
    }
    
    private CartDto convertToDto(Cart cart) {
        // Get items - JOIN FETCH should have loaded them, but handle null/empty case
        List<CartItem> items = cart.getItems();
        if (items == null) {
            // If not loaded (shouldn't happen with JOIN FETCH, but safety check)
            items = cartItemRepository.findByCartId(cart.getId());
        }
        
        List<CartItemDto> itemDtos = items.stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList());
        
        BigDecimal subtotal = itemDtos.stream()
                .map(CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalDiscount = itemDtos.stream()
                .map(item -> {
                    BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    return itemTotal.multiply(item.getDiscountPercentage()).divide(BigDecimal.valueOf(100));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return CartDto.builder()
                .id(cart.getId())
                .patientId(cart.getPatientId())
                .items(itemDtos)
                .subtotal(subtotal)
                .totalDiscount(totalDiscount)
                .total(subtotal.subtract(totalDiscount))
                .itemCount(itemDtos.size())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
    
    private CartItemDto convertItemToDto(CartItem item) {
        // Fetch medicine name and image from medicines table
        MedicineInfo medicineInfo = getMedicineInfo(item.getMedicineId());
        
        return CartItemDto.builder()
                .id(item.getId())
                .medicineId(item.getMedicineId())
                .medicineName(medicineInfo != null ? medicineInfo.name : "Unknown Medicine")
                .medicineImageUrl(medicineInfo != null ? medicineInfo.imageUrl : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .discountPercentage(item.getDiscountPercentage())
                .totalPrice(item.getTotalPrice())
                .inStock(medicineInfo != null ? medicineInfo.inStock : false)
                .build();
    }
    
    private MedicineInfo getMedicineInfo(UUID medicineId) {
        String query = """
            SELECT m.name, m.image_url,
                   COALESCE(SUM(mi.quantity_available), 0) as total_stock
            FROM medicines m
            LEFT JOIN medicine_inventory mi ON m.id = mi.medicine_id
            AND mi.expiry_date > CURRENT_DATE
            WHERE m.id = :medicineId
            GROUP BY m.id, m.name, m.image_url
            """;
        
        try {
            Object[] result = (Object[]) entityManager.createNativeQuery(query)
                    .setParameter("medicineId", medicineId)
                    .getSingleResult();
            
            String name = (String) result[0];
            String imageUrl = (String) result[1];
            Long totalStock = ((Number) result[2]).longValue();
            
            return new MedicineInfo(name, imageUrl, totalStock > 0);
        } catch (Exception e) {
            log.error("Error fetching medicine info for medicineId: {}", medicineId, e);
            return null;
        }
    }
    
    private record MedicinePricing(BigDecimal unitPrice, BigDecimal discountPercentage, boolean inStock) {}
    private record MedicineInfo(String name, String imageUrl, boolean inStock) {}
}

