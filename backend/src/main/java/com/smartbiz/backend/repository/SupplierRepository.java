package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    List<Supplier> findAllByBusiness_IdAndActiveTrue(Long businessId);

    Optional<Supplier> findByIdAndBusiness_Id(Long id, Long businessId);

    Optional<Supplier> findByIdAndBusiness_IdAndActiveTrue(Long id, Long businessId);

    boolean existsByBusiness_IdAndNameIgnoreCaseAndActiveTrue(Long businessId, String name);
}
