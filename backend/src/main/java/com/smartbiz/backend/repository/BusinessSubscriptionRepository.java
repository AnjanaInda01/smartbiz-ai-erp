package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BusinessSubscriptionRepository extends JpaRepository<BusinessSubscription, Long> {
    Optional<BusinessSubscription>
    findByBusiness_IdAndStatus(Long businessId, SubscriptionStatus status);

    List<BusinessSubscription> findByBusiness_Id(Long businessId);

    @Query("""
            select bs
            from BusinessSubscription bs
            where bs.status = com.smartbiz.backend.enums.SubscriptionStatus.ACTIVE
            """)
    List<BusinessSubscription> findAllActive();

}
