package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.entity.SubscriptionPlan;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.repository.BusinessSubscriptionRepository;
import com.smartbiz.backend.service.SubscriptionAssignmentService;
import com.smartbiz.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {
    private final BusinessSubscriptionRepository subscriptionRepository;
    private final SubscriptionAssignmentService subscriptionAssignmentService;

    @Override
    @Transactional
    public SubscriptionPlan getCurrentPlan(Long businessId) {
        BusinessSubscription subscription =
                subscriptionRepository
                        .findByBusiness_IdAndStatus(
                                businessId,
                                SubscriptionStatus.ACTIVE
                        )
                        .orElse(null);

        // If no subscription found, try to assign FREE plan automatically
        if (subscription == null) {
            subscriptionAssignmentService.assignFreePlanToBusinessIfNeeded(businessId);
            
            // Retry getting subscription after assignment
            subscription = subscriptionRepository
                    .findByBusiness_IdAndStatus(
                            businessId,
                            SubscriptionStatus.ACTIVE
                    )
                    .orElseThrow(() ->
                            new BadRequestException("No active subscription found. Please contact support or subscribe to a plan."));
        }

        return subscription.getPlan();
    }
}
