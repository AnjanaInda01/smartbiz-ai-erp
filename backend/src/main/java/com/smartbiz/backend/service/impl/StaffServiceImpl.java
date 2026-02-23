package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.StaffCreateRequest;
import com.smartbiz.backend.dto.request.StaffUpdateRequest;
import com.smartbiz.backend.dto.response.StaffResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.Staff;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.StaffRepository;
import com.smartbiz.backend.repository.UserRepository;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.StaffService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public StaffResponse createStaff(StaffCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("A staff member with this email already exists");
        }

        User owner = currentUserService.getCurrentUser();
        Business business = owner.getBusiness();
        if (business == null) {
            throw new BadRequestException("Owner must belong to a business");
        }

        // Create login user for staff
        User staffUser = new User();
        staffUser.setEmail(request.getEmail());
        staffUser.setPassword(passwordEncoder.encode(request.getPassword()));
        staffUser.setRole(Role.STAFF);
        staffUser.setBusiness(business);
        staffUser.setName(request.getName());

        User savedUser = userRepository.save(staffUser);

        // Create staff profile
        Staff staff = Staff.builder()
                .business(business)
                .user(savedUser)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .active(true)
                .build();

        Staff savedStaff = staffRepository.save(staff);
        return toStaffResponse(savedStaff);
    }

    @Override
    public List<StaffResponse> getAllStaff() {
        Long businessId = currentUserService.getCurrentBusinessId();
        List<Staff> staffMembers = staffRepository.findAllByBusiness_Id(businessId);
        return staffMembers.stream()
                .map(this::toStaffResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StaffResponse getStaffById(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();
        Staff staff = staffRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));

        return toStaffResponse(staff);
    }

    @Override
    public StaffResponse updateStaff(Long id, StaffUpdateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();
        Staff staff = staffRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));

        User staffUser = staff.getUser();

        // Update email if provided and different
        if (request.getEmail() != null && !request.getEmail().equals(staff.getEmail())) {
            userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                if (!existing.getId().equals(staffUser.getId())) {
                    throw new ConflictException("A staff member with this email already exists");
                }
            });
            staff.setEmail(request.getEmail());
            staffUser.setEmail(request.getEmail());
        }

        // Update name if provided
        if (request.getName() != null) {
            staff.setName(request.getName());
            staffUser.setName(request.getName());
        }

        // Update phone if provided
        if (request.getPhone() != null) {
            staff.setPhone(request.getPhone());
        }

        // Update active status if provided
        if (request.getActive() != null) {
            staff.setActive(request.getActive());
        }

        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            staffUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(staffUser);
        Staff updatedStaff = staffRepository.save(staff);
        return toStaffResponse(updatedStaff);
    }

    @Override
    public void deleteStaff(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();
        Staff staff = staffRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));

        User staffUser = staff.getUser();

        staffRepository.delete(staff);
        if (staffUser != null) {
            userRepository.delete(staffUser);
        }
    }

    private StaffResponse toStaffResponse(Staff staff) {
        return new StaffResponse(
                staff.getId(),
                staff.getName(),
                staff.getEmail(),
                staff.getPhone(),
                staff.isActive(),
                staff.getBusiness() != null ? staff.getBusiness().getId() : null,
                staff.getCreatedAt(),
                staff.getUpdatedAt()
        );
    }
}

