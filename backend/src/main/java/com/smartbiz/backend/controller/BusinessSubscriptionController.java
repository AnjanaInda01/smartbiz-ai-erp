package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.response.BusinessSubscriptionResponse;
import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.entity.SubscriptionPlan;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessSubscriptionRepository;
import com.smartbiz.backend.repository.SubscriptionPlanRepository;
import com.smartbiz.backend.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/business-subscriptions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class BusinessSubscriptionController {

    private final BusinessSubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final CurrentUserService currentUserService;

    @GetMapping("/current")
    public ResponseEntity<BusinessSubscriptionResponse> getCurrent() {
        Long businessId = currentUserService.getCurrentBusinessId();
        
        BusinessSubscription subscription = subscriptionRepository
                .findByBusiness_IdAndStatus(businessId, SubscriptionStatus.ACTIVE)
                .orElse(null);

        if (subscription == null) {
            return ResponseEntity.ok(null);
        }

        BusinessSubscriptionResponse response = BusinessSubscriptionResponse.builder()
                .id(subscription.getId())
                .planId(subscription.getPlan().getId())
                .planName(subscription.getPlan().getName())
                .price(subscription.getPlan().getMonthlyPrice())
                .status(subscription.getStatus().name())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<BusinessSubscriptionResponse> subscribe(@RequestBody SubscribeRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found"));

        if (!plan.getActive()) {
            throw new BadRequestException("This subscription plan is not active");
        }

        // Deactivate current active subscription
        subscriptionRepository
                .findByBusiness_IdAndStatus(businessId, SubscriptionStatus.ACTIVE)
                .ifPresent(old -> {
                    old.setStatus(SubscriptionStatus.EXPIRED);
                    old.setEndDate(LocalDate.now());
                    subscriptionRepository.save(old);
                });

        // Create new subscription
        BusinessSubscription subscription = new BusinessSubscription();
        subscription.setBusiness(currentUserService.getCurrentUser().getBusiness());
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        // Set end date to 1 month from now (or adjust based on plan duration)
        subscription.setEndDate(LocalDate.now().plusMonths(1));
        
        subscription = subscriptionRepository.save(subscription);

        BusinessSubscriptionResponse response = BusinessSubscriptionResponse.builder()
                .id(subscription.getId())
                .planId(subscription.getPlan().getId())
                .planName(subscription.getPlan().getName())
                .price(subscription.getPlan().getMonthlyPrice())
                .status(subscription.getStatus().name())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel")
    @Transactional
    public ResponseEntity<?> cancel() {
        Long businessId = currentUserService.getCurrentBusinessId();

        BusinessSubscription subscription = subscriptionRepository
                .findByBusiness_IdAndStatus(businessId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new BadRequestException("No active subscription found"));

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setEndDate(LocalDate.now());
        subscriptionRepository.save(subscription);

        return ResponseEntity.ok("Subscription cancelled successfully");
    }

    @GetMapping("/history")
    public ResponseEntity<List<BusinessSubscriptionResponse>> getHistory() {
        Long businessId = currentUserService.getCurrentBusinessId();

        List<BusinessSubscription> subscriptions = subscriptionRepository
                .findByBusiness_Id(businessId);

        List<BusinessSubscriptionResponse> responses = subscriptions.stream()
                .map(sub -> BusinessSubscriptionResponse.builder()
                        .id(sub.getId())
                        .planId(sub.getPlan().getId())
                        .planName(sub.getPlan().getName())
                        .price(sub.getPlan().getMonthlyPrice())
                        .status(sub.getStatus().name())
                        .startDate(sub.getStartDate())
                        .endDate(sub.getEndDate())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // Request DTO
    public static class SubscribeRequest {
        private Long planId;

        public Long getPlanId() {
            return planId;
        }

        public void setPlanId(Long planId) {
            this.planId = planId;
        }
    }
}
