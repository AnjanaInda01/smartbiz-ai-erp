package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.CustomerCreateRequest;
import com.smartbiz.backend.dto.request.CustomerUpdateRequest;
import com.smartbiz.backend.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {
    CustomerResponse create(CustomerCreateRequest request);
    List<CustomerResponse> getAllActive();
    CustomerResponse getById(Long id);
    CustomerResponse update(Long id, CustomerUpdateRequest request);
    void delete(Long id); // soft delete
}
