package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findAllByBusiness_Id(Long businessId);

    Optional<Product> findByIdAndBusiness_Id(Long id, Long businessId);

    boolean existsBySkuAndBusiness_Id(String sku, Long businessId);

    long countByBusiness_Id(Long businessId);
    List<Product> findAllByBusiness_IdAndStockQtyLessThan(Long businessId, Integer qty);

}
