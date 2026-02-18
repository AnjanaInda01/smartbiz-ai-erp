package com.smartbiz.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemStatisticsResponse {
    private Long totalBusinesses;
    private Long totalUsers;
    private Long totalProducts;
    private Long totalCustomers;
    private Long totalInvoices;
    private Long totalAiRequests;
    private Long activeSubscriptions;
}
