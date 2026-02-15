package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.PurchaseCreateRequest;
import com.smartbiz.backend.dto.response.PurchaseResponse;

import java.util.List;

public interface PurchaseService {
    PurchaseResponse create(PurchaseCreateRequest request);
    PurchaseResponse confirm(Long id); // increases stock
    List<PurchaseResponse> getAll();
    PurchaseResponse getById(Long id);
}
