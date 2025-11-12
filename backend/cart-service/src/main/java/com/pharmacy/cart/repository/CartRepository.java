package com.pharmacy.cart.repository;

import com.pharmacy.cart.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.QueryHint;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.patientId = :patientId")
    @QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "false"))
    Optional<Cart> findByPatientId(@Param("patientId") UUID patientId);
}


