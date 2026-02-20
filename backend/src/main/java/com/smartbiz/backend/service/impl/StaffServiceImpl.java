package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.StaffCreateRequest;
import com.smartbiz.backend.dto.request.StaffUpdateRequest;
import com.smartbiz.backend.dto.response.StaffResponse;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
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
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public StaffResponse createStaff(StaffCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("A staff member with this email already exists");
        }

        User owner = currentUserService.getCurrentUser();
        if (owner.getBusiness() == null) {
            throw new BadRequestException("Owner must belong to a business");
        }

        User staff = new User();
        staff.setEmail(request.getEmail());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setRole(Role.STAFF);
        staff.setBusiness(owner.getBusiness());
        staff.setName(request.getName());
        // Note: Phone field not in User entity yet - can be added later if needed

        User savedStaff = userRepository.save(staff);
        return toStaffResponse(savedStaff);
    }

    @Override
    public List<StaffResponse> getAllStaff() {
        Long businessId = currentUserService.getCurrentBusinessId();
        List<User> staffMembers = userRepository.findByBusiness_IdAndRole(businessId, Role.STAFF);
        return staffMembers.stream()
                .map(this::toStaffResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StaffResponse getStaffById(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));

        if (!staff.getRole().equals(Role.STAFF)) {
            throw new ResourceNotFoundException("Staff member not found with id: " + id);
        }

        if (staff.getBusiness() == null || !staff.getBusiness().getId().equals(businessId)) {
            throw new BadRequestException("Staff member does not belong to your business");
        }

        return toStaffResponse(staff);
    }

    @Override
    public StaffResponse updateStaff(Long id, StaffUpdateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));

        if (!staff.getRole().equals(Role.STAFF)) {
            throw new ResourceNotFoundException("Staff member not found with id: " + id);
        }

        if (staff.getBusiness() == null || !staff.getBusiness().getId().equals(businessId)) {
            throw new BadRequestException("Staff member does not belong to your business");
        }

        // Update email if provided and different
        if (request.getEmail() != null && !request.getEmail().equals(staff.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new ConflictException("A staff member with this email already exists");
            }
            staff.setEmail(request.getEmail());
        }

        // Update name if provided
        if (request.getName() != null) {
            staff.setName(request.getName());
        }

        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Note: Phone field not in User entity yet - can be added later if needed

        User updatedStaff = userRepository.save(staff);
        return toStaffResponse(updatedStaff);
    }

    @Override
    public void deleteStaff(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));

        if (!staff.getRole().equals(Role.STAFF)) {
            throw new ResourceNotFoundException("Staff member not found with id: " + id);
        }

        if (staff.getBusiness() == null || !staff.getBusiness().getId().equals(businessId)) {
            throw new BadRequestException("Staff member does not belong to your business");
        }

        userRepository.delete(staff);
    }

    private StaffResponse toStaffResponse(User user) {
        // Note: User entity doesn't have createdAt/updatedAt fields
        // Returning null for timestamps - can be updated if User entity is extended
        return new StaffResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                null, // Phone not in User entity yet
                user.getBusiness() != null ? user.getBusiness().getId() : null,
                null, // createdAt not in User entity
                null  // updatedAt not in User entity
        );
    }
}
