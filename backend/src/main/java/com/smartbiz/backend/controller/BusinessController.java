package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.response.BusinessResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/businesses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class BusinessController {

    private final BusinessRepository businessRepository;

    @GetMapping
    public ResponseEntity<List<BusinessResponse>> getAllBusinesses() {
        List<Business> businesses = businessRepository.findAll();
        List<BusinessResponse> responses = businesses.stream()
                .map(business -> BusinessResponse.builder()
                        .id(business.getId())
                        .name(business.getName())
                        .email(business.getEmail())
                        .phone(business.getPhone())
                        .address(business.getAddress())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessResponse> getBusiness(@PathVariable Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + id));
        BusinessResponse response = BusinessResponse.builder()
                .id(business.getId())
                .name(business.getName())
                .email(business.getEmail())
                .phone(business.getPhone())
                .address(business.getAddress())
                .build();
        return ResponseEntity.ok(response);
    }
}
