package com.smartbiz.backend.controller;

import com.smartbiz.backend.entity.SubscriptionPlan;
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
        return ResponseEntity.ok(planRepository.save(plan));
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> list() {
        return ResponseEntity.ok(planRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> update(
            @PathVariable Long id,
            @RequestBody SubscriptionPlan updated) {

        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        plan.setMonthlyPrice(updated.getMonthlyPrice());
        plan.setMaxUsers(updated.getMaxUsers());
        plan.setMaxProducts(updated.getMaxProducts());
        plan.setMaxAiRequestsPerMonth(updated.getMaxAiRequestsPerMonth());

        return ResponseEntity.ok(planRepository.save(plan));
    }
}
