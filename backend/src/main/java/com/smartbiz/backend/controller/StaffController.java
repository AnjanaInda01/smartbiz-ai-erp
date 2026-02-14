package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.StaffCreateRequest;
import com.smartbiz.backend.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;

    // Only OWNER or ADMIN can create staff
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @PostMapping
    public ResponseEntity<Void> createStaff(@Valid @RequestBody StaffCreateRequest request) {
        staffService.createStaff(request);
        return ResponseEntity.ok().build();
    }
}
