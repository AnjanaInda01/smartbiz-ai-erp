package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findAllByBusiness_Id(Long businessId);

    Optional<Staff> findByIdAndBusiness_Id(Long id, Long businessId);

    Optional<Staff> findByUser_Email(String email);
}

