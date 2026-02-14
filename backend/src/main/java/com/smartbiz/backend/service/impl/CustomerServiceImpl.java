package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.CustomerCreateRequest;
import com.smartbiz.backend.dto.request.CustomerUpdateRequest;
import com.smartbiz.backend.dto.response.CustomerResponse;
import com.smartbiz.backend.service.CustomerService;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.Customer;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.CustomerRepository;
import com.smartbiz.backend.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final BusinessRepository businessRepository;
    private final CurrentUserService currentUserService;

    @Override
    public CustomerResponse create(CustomerCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        if (customerRepository.existsByBusiness_IdAndNameIgnoreCaseAndActiveTrue(businessId, request.getName())) {
            throw new ConflictException("Customer name already exists");
        }

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));

        Customer customer = Customer.builder()
                .business(business)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .active(true)
                .build();

        return toResponse(customerRepository.save(customer));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllActive() {
        Long businessId = currentUserService.getCurrentBusinessId();
        return customerRepository.findAllByBusiness_IdAndActiveTrue(businessId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getById(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();
        Customer customer = customerRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        return toResponse(customer);
    }

    @Override
    public CustomerResponse update(Long id, CustomerUpdateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Customer customer = customerRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));

        String newName = request.getName();
        boolean changed = !customer.getName().equalsIgnoreCase(newName);
        if (changed && customerRepository.existsByBusiness_IdAndNameIgnoreCaseAndActiveTrue(businessId, newName)) {
            throw new ConflictException("Customer name already exists");
        }

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());

        if (request.getActive() != null) {
            customer.setActive(request.getActive());
        }

        return toResponse(customerRepository.save(customer));
    }

    @Override
    public void delete(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Customer customer = customerRepository.findByIdAndBusiness_IdAndActiveTrue(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Active customer not found: " + id));

        customer.setActive(false); // soft delete
        customerRepository.save(customer);
    }

    private CustomerResponse toResponse(Customer c) {
        return new CustomerResponse(
                c.getId(),
                c.getName(),
                c.getEmail(),
                c.getPhone(),
                c.isActive(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
