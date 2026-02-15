package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.InvoiceCreateRequest;
import com.smartbiz.backend.dto.response.InvoiceResponse;
import com.smartbiz.backend.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    // Create DRAFT (no stock deduction)
    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    @PostMapping
    public ResponseEntity<InvoiceResponse> createDraft(@Valid @RequestBody InvoiceCreateRequest request) {
        return ResponseEntity.ok(invoiceService.createDraft(request));
    }

    // Confirm = Stock OUT
    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    @PostMapping("/{id}/confirm")
    public ResponseEntity<InvoiceResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.confirm(id));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> list() {
        return ResponseEntity.ok(invoiceService.list());
    }
}
