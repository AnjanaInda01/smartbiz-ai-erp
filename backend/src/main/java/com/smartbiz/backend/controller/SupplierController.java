package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.SupplierCreateRequest;
import com.smartbiz.backend.dto.request.SupplierUpdateRequest;
import com.smartbiz.backend.dto.response.SupplierResponse;
import com.smartbiz.backend.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    // STAFF can CRUD (as you decided)
    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PostMapping
    public ResponseEntity<SupplierResponse> create(@Valid @RequestBody SupplierCreateRequest request) {
        return ResponseEntity.ok(supplierService.create(request));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAllActive() {
        return ResponseEntity.ok(supplierService.getAllActive());
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getById(id));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SupplierUpdateRequest request
    ) {
        return ResponseEntity.ok(supplierService.update(id, request));
    }

    // Soft delete (you said staff can CRUD, so allow staff too)
    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
