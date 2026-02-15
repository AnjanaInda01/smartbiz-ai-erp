package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierProductRepository extends JpaRepository<SupplierProduct, Long> {
    boolean existsByBusiness_IdAndSupplier_IdAndProduct_Id(Long businessId, Long supplierId, Long productId);

    Optional<SupplierProduct> findByIdAndBusiness_Id(Long id, Long businessId);

    List<SupplierProduct> findAllByBusiness_IdAndActiveTrue(Long businessId);

    List<SupplierProduct> findAllByBusiness_IdAndSupplier_IdAndActiveTrue(Long businessId, Long supplierId);

    List<SupplierProduct> findAllByBusiness_IdAndProduct_IdAndActiveTrue(Long businessId, Long productId);
}
