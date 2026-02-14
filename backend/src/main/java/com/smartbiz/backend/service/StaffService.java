package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.StaffCreateRequest;

public interface StaffService {
    void createStaff(StaffCreateRequest request);
}
