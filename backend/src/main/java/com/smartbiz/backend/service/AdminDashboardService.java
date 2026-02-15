package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.response.AdminAiUsageResponse;

import java.util.List;

public interface AdminDashboardService {
    List<AdminAiUsageResponse> getAiUsageSummary();
}
