package com.pharmacy.catalog.controller;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.catalog.dto.MedicineDto;
import com.pharmacy.catalog.model.Medicine;
import com.pharmacy.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
public class CatalogController {
    
    private final CatalogService catalogService;
    
    @GetMapping("/medicines")
    public ResponseEntity<ApiResponse<List<MedicineDto>>> getAllMedicines(
            @RequestParam(required = false, name = "search") String search,
            @RequestParam(required = false, name = "form") String form,
            @RequestParam(required = false, name = "schedule") String schedule,
            @RequestParam(required = false, name = "prescriptionRequired") Boolean prescriptionRequired
    ) {
        log.info("Get medicines request - search: {}, form: {}, schedule: {}, prescriptionRequired: {}", 
                search, form, schedule, prescriptionRequired);
        
        List<MedicineDto> medicines;
        
        // Check if any filter/search is provided
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasFilters = form != null || schedule != null || prescriptionRequired != null;
        
        if (hasSearch || hasFilters) {
            Medicine.Form formEnum = form != null ? Medicine.Form.valueOf(form.toUpperCase()) : null;
            Medicine.Schedule scheduleEnum = schedule != null ? Medicine.Schedule.valueOf(schedule.toUpperCase()) : null;
            
            medicines = catalogService.searchAndFilterMedicines(
                    search,
                    formEnum,
                    scheduleEnum,
                    prescriptionRequired
            );
        } else {
            medicines = catalogService.getAllMedicines();
        }
        
        return ResponseEntity.ok(ApiResponse.success(medicines));
    }
    
    @GetMapping("/medicines/{id}")
    public ResponseEntity<ApiResponse<MedicineDto>> getMedicineById(@PathVariable(name = "id") UUID id) {
        log.info("Get medicine by id: {}", id);
        MedicineDto medicine = catalogService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponse.success(medicine));
    }
    
    @GetMapping("/medicines/search")
    public ResponseEntity<ApiResponse<List<MedicineDto>>> searchMedicines(
            @RequestParam(name = "q") String q
    ) {
        log.info("Search medicines with query: {}", q);
        List<MedicineDto> medicines = catalogService.searchMedicines(q);
        return ResponseEntity.ok(ApiResponse.success(medicines));
    }
}

