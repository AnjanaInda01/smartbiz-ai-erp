package com.smartbiz.backend.service;

import com.smartbiz.backend.entity.SubscriptionPlan;

public interface SubscriptionService {
    SubscriptionPlan getCurrentPlan(Long businessId);
}

