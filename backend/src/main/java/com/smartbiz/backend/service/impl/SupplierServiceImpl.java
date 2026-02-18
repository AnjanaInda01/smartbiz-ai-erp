package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.SupplierCreateRequest;
import com.smartbiz.backend.dto.request.SupplierUpdateRequest;
import com.smartbiz.backend.dto.response.SupplierResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.Supplier;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.SupplierRepository;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.SubscriptionAssignmentService;
import com.smartbiz.backend.service.SupplierService;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final BusinessRepository businessRepository;
    private final CurrentUserService currentUserService;
    private final SubscriptionAssignmentService subscriptionAssignmentService;

    @Override
    public SupplierResponse create(SupplierCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        // Ensure business has a subscription (auto-assign FREE if needed)
        subscriptionAssignmentService.assignFreePlanToBusinessIfNeeded(businessId);

        // Prevent duplicate supplier name within same business (active only)
        if (supplierRepository.existsByBusiness_IdAndNameIgnoreCaseAndActiveTrue(businessId, request.getName())) {
            throw new ConflictException("Supplier name already exists");
        }

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));

        Supplier supplier = Supplier.builder()
                .business(business)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .active(true)
                .build();

        return toResponse(supplierRepository.save(supplier));
    }

    @Override
    @Transactional(readOnly=true)
    public List<SupplierResponse> getAllActive() {
        Long businessId = currentUserService.getCurrentBusinessId();

        return supplierRepository.findAllByBusiness_IdAndActiveTrue(businessId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponse getById(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Supplier supplier = supplierRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));

        return toResponse(supplier);
    }

    @Override
    public SupplierResponse update(Long id, SupplierUpdateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Supplier supplier = supplierRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));

        // If name changed, check duplicate
        String newName = request.getName();
        boolean changed = !supplier.getName().equalsIgnoreCase(newName);
        if (changed && supplierRepository.existsByBusiness_IdAndNameIgnoreCaseAndActiveTrue(businessId, newName)) {
            throw new ConflictException("Supplier name already exists");
        }

        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());

        if (request.getActive() != null) {
            supplier.setActive(request.getActive());
        }

        return toResponse(supplierRepository.save(supplier));
    }

    @Override
    public void delete(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Supplier supplier = supplierRepository.findByIdAndBusiness_IdAndActiveTrue(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Active supplier not found: " + id));

        supplier.setActive(false); // soft delete
        supplierRepository.save(supplier);
    }

    private SupplierResponse toResponse(Supplier s) {
        return new SupplierResponse(
                s.getId(),
                s.getName(),
                s.getEmail(),
                s.getPhone(),
                s.isActive(),
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}
