package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.SupplierProductCreateRequest;
import com.smartbiz.backend.dto.request.SupplierProductUpdateRequest;
import com.smartbiz.backend.dto.response.SupplierProductResponse;
import com.smartbiz.backend.service.SupplierProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/supplier-products")
@RequiredArgsConstructor
public class SupplierProductController {

    private final SupplierProductService supplierProductService;

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PostMapping
    public ResponseEntity<SupplierProductResponse> create(@Valid @RequestBody SupplierProductCreateRequest request) {
        return ResponseEntity.ok(supplierProductService.create(request));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SupplierProductResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SupplierProductUpdateRequest request
    ) {
        return ResponseEntity.ok(supplierProductService.update(id, request));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierProductService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping
    public ResponseEntity<List<SupplierProductResponse>> getAllActive() {
        return ResponseEntity.ok(supplierProductService.getAllActive());
    }

    // For Product page: show all suppliers who supply this product
    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping("/product/{productId}/suppliers")
    public ResponseEntity<List<SupplierProductResponse>> getSuppliersForProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(supplierProductService.getSuppliersForProduct(productId));
    }

    // For Supplier page: show all products supplied by this supplier
    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping("/supplier/{supplierId}/products")
    public ResponseEntity<List<SupplierProductResponse>> getProductsForSupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(supplierProductService.getProductsForSupplier(supplierId));
    }
}
