package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessSubscriptionRepository extends JpaRepository<BusinessSubscription, Long> {
    Optional<BusinessSubscription>
    findByBusiness_IdAndStatus(Long businessId, SubscriptionStatus status);

}
