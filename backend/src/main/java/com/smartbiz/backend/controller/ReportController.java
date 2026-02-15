package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.response.DashboardResponse;
import com.smartbiz.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(reportService.dashboard());
    }
}
