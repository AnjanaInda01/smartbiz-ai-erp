package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    Optional<Purchase> findByIdAndBusiness_Id(Long id, Long businessId);

    List<Purchase> findAllByBusiness_IdOrderByIdDesc(Long businessId);

    long countByBusiness_Id(Long businessId);
}
