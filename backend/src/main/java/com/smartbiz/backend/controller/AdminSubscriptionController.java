package com.smartbiz.backend.controller;

import com.smartbiz.backend.entity.*;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSubscriptionController {

    private final BusinessRepository businessRepository;
    private final SubscriptionPlanRepository planRepository;
    private final BusinessSubscriptionRepository businessSubscriptionRepository;

    @PostMapping("/business/{businessId}/assign-plan/{planId}")
    public ResponseEntity<?> assignPlan(
            @PathVariable Long businessId,
            @PathVariable Long planId) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        // deactivate old active subscription
        businessSubscriptionRepository
                .findByBusiness_IdAndStatus(businessId, SubscriptionStatus.ACTIVE)
                .ifPresent(old -> {
                    old.setStatus(SubscriptionStatus.EXPIRED);
                    old.setEndDate(LocalDate.now());
                    businessSubscriptionRepository.save(old);
                });

        BusinessSubscription subscription = new BusinessSubscription();
        subscription.setBusiness(business);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        businessSubscriptionRepository.save(subscription);

        return ResponseEntity.ok("Plan assigned successfully");
    }
}
