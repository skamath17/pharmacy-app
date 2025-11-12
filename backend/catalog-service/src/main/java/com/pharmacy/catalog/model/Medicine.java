package com.pharmacy.catalog.model;

import com.pharmacy.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Medicine extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "generic_name")
    private String genericName;
    
    private String manufacturer;
    
    private String strength;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Form form;
    
    @Column(name = "prescription_required")
    private Boolean prescriptionRequired = true;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Schedule schedule;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status = Status.ACTIVE;
    
    @OneToMany(mappedBy = "medicine", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicineInventory> inventory;
    
    public enum Form {
        TABLET, CAPSULE, SYRUP, INJECTION, CREAM, DROPS, OTHER
    }
    
    public enum Schedule {
        H, H1, X, NONE
    }
    
    public enum Status {
        ACTIVE, INACTIVE, DISCONTINUED
    }
}


