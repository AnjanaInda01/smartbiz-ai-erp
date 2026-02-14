package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.CustomerCreateRequest;
import com.smartbiz.backend.dto.request.CustomerUpdateRequest;
import com.smartbiz.backend.dto.response.CustomerResponse;
import com.smartbiz.backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PostMapping
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerCreateRequest request) {
        return ResponseEntity.ok(customerService.create(request));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllActive() {
        return ResponseEntity.ok(customerService.getAllActive());
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest request
    ) {
        return ResponseEntity.ok(customerService.update(id, request));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
