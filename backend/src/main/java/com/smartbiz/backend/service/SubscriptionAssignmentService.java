package com.smartbiz.backend.service;

public interface SubscriptionAssignmentService {

    void assignFreePlanToBusinessIfNeeded(Long businessId);

    void assignFreePlansToAllBusinessesWithoutSubscription();
}
