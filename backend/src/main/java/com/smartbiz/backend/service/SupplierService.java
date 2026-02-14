package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.SupplierCreateRequest;
import com.smartbiz.backend.dto.request.SupplierUpdateRequest;
import com.smartbiz.backend.dto.response.SupplierResponse;
import java.util.List;
public interface SupplierService {
    SupplierResponse create(SupplierCreateRequest request);
    List<SupplierResponse> getAllActive();
    SupplierResponse getById(Long id);
    SupplierResponse update(Long id, SupplierUpdateRequest request);
    void delete(Long id); // soft delete
}
