package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByBusiness_IdAndRole(Long businessId, Role role);
}
