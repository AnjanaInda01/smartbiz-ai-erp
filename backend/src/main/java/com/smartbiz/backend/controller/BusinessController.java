package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.BusinessCreateRequest;
import com.smartbiz.backend.dto.response.BusinessResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.BusinessSubscriptionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/businesses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class BusinessController {

    private final BusinessRepository businessRepository;
    private final BusinessSubscriptionRepository businessSubscriptionRepository;

    @GetMapping
    public ResponseEntity<List<BusinessResponse>> getAllBusinesses() {
        List<Business> businesses = businessRepository.findAll();
        List<BusinessResponse> responses = businesses.stream()
                .map(business -> {
                    // Get active subscription for this business
                    Optional<com.smartbiz.backend.entity.BusinessSubscription> activeSubscription =
                            businessSubscriptionRepository.findByBusiness_IdAndStatus(
                                    business.getId(),
                                    SubscriptionStatus.ACTIVE
                            );

                    String planName = null;
                    String planStatus = null;
                    if (activeSubscription.isPresent()) {
                        planName = activeSubscription.get().getPlan().getName();
                        planStatus = activeSubscription.get().getStatus().name();
                    }

                    return BusinessResponse.builder()
                            .id(business.getId())
                            .name(business.getName())
                            .email(business.getEmail())
                            .phone(business.getPhone())
                            .address(business.getAddress())
                            .subscriptionPlan(planName)
                            .subscriptionStatus(planStatus)
                            .build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<BusinessResponse> createBusiness(@Valid @RequestBody BusinessCreateRequest request) {
        // Check if email already exists
        if (businessRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Business with this email already exists");
        }

        Business business = new Business();
        business.setName(request.getName());
        business.setEmail(request.getEmail());
        business.setPhone(request.getPhone());
        business.setAddress(request.getAddress());
        business = businessRepository.save(business);

        BusinessResponse response = BusinessResponse.builder()
                .id(business.getId())
                .name(business.getName())
                .email(business.getEmail())
                .phone(business.getPhone())
                .address(business.getAddress())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessResponse> getBusiness(@PathVariable Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + id));

        // Get active subscription for this business
        Optional<com.smartbiz.backend.entity.BusinessSubscription> activeSubscription =
                businessSubscriptionRepository.findByBusiness_IdAndStatus(
                        business.getId(),
                        SubscriptionStatus.ACTIVE
                );

        String planName = null;
        String planStatus = null;
        if (activeSubscription.isPresent()) {
            planName = activeSubscription.get().getPlan().getName();
            planStatus = activeSubscription.get().getStatus().name();
        }

        BusinessResponse response = BusinessResponse.builder()
                .id(business.getId())
                .name(business.getName())
                .email(business.getEmail())
                .phone(business.getPhone())
                .address(business.getAddress())
                .subscriptionPlan(planName)
                .subscriptionStatus(planStatus)
                .build();
        return ResponseEntity.ok(response);
    }
}
