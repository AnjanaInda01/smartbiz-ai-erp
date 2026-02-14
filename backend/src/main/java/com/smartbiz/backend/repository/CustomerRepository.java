package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findAllByBusiness_IdAndActiveTrue(Long businessId);

    Optional<Customer> findByIdAndBusiness_Id(Long id, Long businessId);

    Optional<Customer> findByIdAndBusiness_IdAndActiveTrue(Long id, Long businessId);

    boolean existsByBusiness_IdAndNameIgnoreCaseAndActiveTrue(Long businessId, String name);
}
