package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.ProductCreateRequest;
import com.smartbiz.backend.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse create(ProductCreateRequest request);
    List<ProductResponse> getAll();
    ProductResponse getById(Long id);
    ProductResponse update(Long id, ProductCreateRequest request);
    void delete(Long id);
}
