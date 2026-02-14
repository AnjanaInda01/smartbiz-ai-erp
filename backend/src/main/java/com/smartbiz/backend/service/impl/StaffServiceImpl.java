package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.StaffCreateRequest;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.repository.UserRepository;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.StaffService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void createStaff(StaffCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists");
        }

        User owner = currentUserService.getCurrentUser(); // OWNER user
        User staff = new User();
        staff.setEmail(request.getEmail());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setRole(Role.STAFF);
        staff.setBusiness(owner.getBusiness());
        staff.setName(request.getName());


        userRepository.save(staff);
    }
}
