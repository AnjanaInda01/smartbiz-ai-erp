package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.AiRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;

public interface AiRequestRepository
        extends JpaRepository<AiRequest, Long> {

    int countByBusiness_IdAndCreatedAtBetween(
            Long businessId,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
            select count(a)
            from AiRequest a
            where a.business.id = :businessId
              and a.createdAt between :start and :end
            """)
    int countMonthlyUsage(Long businessId,
                          LocalDateTime start,
                          LocalDateTime end);

}
