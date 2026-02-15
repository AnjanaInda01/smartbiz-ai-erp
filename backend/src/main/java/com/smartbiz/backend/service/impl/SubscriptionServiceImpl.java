package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.entity.SubscriptionPlan;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.repository.BusinessSubscriptionRepository;
import com.smartbiz.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubscriptionServiceImpl implements SubscriptionService {
    private final BusinessSubscriptionRepository subscriptionRepository;

    @Override
    public SubscriptionPlan getCurrentPlan(Long businessId) {

        BusinessSubscription subscription =
                subscriptionRepository
                        .findByBusiness_IdAndStatus(
                                businessId,
                                SubscriptionStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new BadRequestException("No active subscription"));

        return subscription.getPlan();
    }
}
