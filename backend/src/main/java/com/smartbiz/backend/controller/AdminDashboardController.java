package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.response.AdminAiUsageResponse;
import com.smartbiz.backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/ai-usage")
    public ResponseEntity<List<AdminAiUsageResponse>> aiUsage() {
        return ResponseEntity.ok(adminDashboardService.getAiUsageSummary());
    }
}
