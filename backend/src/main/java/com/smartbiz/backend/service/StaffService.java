package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.StaffCreateRequest;
import com.smartbiz.backend.dto.request.StaffUpdateRequest;
import com.smartbiz.backend.dto.response.StaffResponse;

import java.util.List;

public interface StaffService {
    StaffResponse createStaff(StaffCreateRequest request);
    List<StaffResponse> getAllStaff();
    StaffResponse getStaffById(Long id);
    StaffResponse updateStaff(Long id, StaffUpdateRequest request);
    void deleteStaff(Long id);
}
