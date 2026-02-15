package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.AiRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface AiRequestRepository
        extends JpaRepository<AiRequest, Long> {

    int countByBusiness_IdAndCreatedAtBetween(
            Long businessId,
            LocalDateTime start,
            LocalDateTime end
    );
}
