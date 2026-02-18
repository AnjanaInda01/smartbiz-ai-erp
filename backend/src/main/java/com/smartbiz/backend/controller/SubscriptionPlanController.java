package com.smartbiz.backend.controller;

import com.smartbiz.backend.entity.SubscriptionPlan;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/plans")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SubscriptionPlanController {
    private final SubscriptionPlanRepository planRepository;

    @PostMapping
    public ResponseEntity<SubscriptionPlan> create(
            @RequestBody SubscriptionPlan plan) {
        // Set defaults if not provided
        if (plan.getActive() == null) {
            plan.setActive(true);
        }
        return ResponseEntity.ok(planRepository.save(plan));
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> list() {
        return ResponseEntity.ok(planRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> getById(@PathVariable Long id) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found: " + id));
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> update(
            @PathVariable Long id,
            @RequestBody SubscriptionPlan updated) {

        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found: " + id));

        // Update all fields
        if (updated.getName() != null) {
            plan.setName(updated.getName());
        }
        if (updated.getMonthlyPrice() != null) {
            plan.setMonthlyPrice(updated.getMonthlyPrice());
        }
        if (updated.getMaxUsers() != null) {
            plan.setMaxUsers(updated.getMaxUsers());
        }
        if (updated.getMaxProducts() != null) {
            plan.setMaxProducts(updated.getMaxProducts());
        }
        if (updated.getMaxAiRequestsPerMonth() != null) {
            plan.setMaxAiRequestsPerMonth(updated.getMaxAiRequestsPerMonth());
        }
        if (updated.getActive() != null) {
            plan.setActive(updated.getActive());
        }

        return ResponseEntity.ok(planRepository.save(plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found: " + id));
        planRepository.delete(plan);
        return ResponseEntity.noContent().build();
    }
}
