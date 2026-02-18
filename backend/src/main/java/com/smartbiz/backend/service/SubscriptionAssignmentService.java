package com.smartbiz.backend.service;

import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.entity.SubscriptionPlan;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.BusinessSubscriptionRepository;
import com.smartbiz.backend.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionAssignmentService {

    private final BusinessRepository businessRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final BusinessSubscriptionRepository businessSubscriptionRepository;

    @Transactional
    public void assignFreePlanToBusinessIfNeeded(Long businessId) {
        // Check if business already has an active subscription
        if (businessSubscriptionRepository
                .findByBusiness_IdAndStatus(businessId, SubscriptionStatus.ACTIVE)
                .isPresent()) {
            return; // Business already has an active subscription
        }

        // Find FREE plan (name = "FREE" or price = 0)
        SubscriptionPlan freePlan = subscriptionPlanRepository.findAll().stream()
                .filter(plan -> plan.getActive() != null && plan.getActive() &&
                               ("FREE".equalsIgnoreCase(plan.getName()) ||
                                plan.getMonthlyPrice().doubleValue() == 0))
                .findFirst()
                .orElse(null);

        if (freePlan != null) {
            Business business = businessRepository.findById(businessId)
                    .orElseThrow(() -> new RuntimeException("Business not found: " + businessId));

            BusinessSubscription subscription = new BusinessSubscription();
            subscription.setBusiness(business);
            subscription.setPlan(freePlan);
            subscription.setStartDate(LocalDate.now());
            subscription.setStatus(SubscriptionStatus.ACTIVE);
            subscription.setEndDate(LocalDate.now().plusYears(1));
            businessSubscriptionRepository.save(subscription);
        }
    }

    @Transactional
    public void assignFreePlansToAllBusinessesWithoutSubscription() {
        List<Business> allBusinesses = businessRepository.findAll();
        
        for (Business business : allBusinesses) {
            boolean hasActiveSubscription = businessSubscriptionRepository
                    .findByBusiness_IdAndStatus(business.getId(), SubscriptionStatus.ACTIVE)
                    .isPresent();
            
            if (!hasActiveSubscription) {
                assignFreePlanToBusinessIfNeeded(business.getId());
            }
        }
    }
}
