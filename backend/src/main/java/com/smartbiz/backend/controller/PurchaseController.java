package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.PurchaseCreateRequest;
import com.smartbiz.backend.dto.response.PurchaseResponse;
import com.smartbiz.backend.service.PurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PostMapping
    public ResponseEntity<PurchaseResponse> create(@Valid @RequestBody PurchaseCreateRequest request) {
        return ResponseEntity.ok(purchaseService.create(request));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PostMapping("/{id}/confirm")
    public ResponseEntity<PurchaseResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseService.confirm(id));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping
    public ResponseEntity<List<PurchaseResponse>> getAll() {
        return ResponseEntity.ok(purchaseService.getAll());
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseService.getById(id));
    }
}
