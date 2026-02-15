package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.SupplierProductCreateRequest;
import com.smartbiz.backend.dto.request.SupplierProductUpdateRequest;
import com.smartbiz.backend.dto.response.SupplierProductResponse;

import java.util.List;

public interface SupplierProductService {
    SupplierProductResponse create(SupplierProductCreateRequest request);

    SupplierProductResponse update(Long id, SupplierProductUpdateRequest request);

    void delete(Long id); // soft delete

    List<SupplierProductResponse> getAllActive();

    List<SupplierProductResponse> getSuppliersForProduct(Long productId);

    List<SupplierProductResponse> getProductsForSupplier(Long supplierId);
}
