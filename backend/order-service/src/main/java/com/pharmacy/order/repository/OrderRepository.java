package com.pharmacy.order.repository;

import com.pharmacy.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.patientId = :patientId ORDER BY o.createdAt DESC")
    List<Order> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") UUID patientId);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") UUID id);
    
    Optional<Order> findByOrderNumber(String orderNumber);
}


