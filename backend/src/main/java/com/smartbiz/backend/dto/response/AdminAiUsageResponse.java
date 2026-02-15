package com.smartbiz.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminAiUsageResponse {

    private Long businessId;
    private String businessName;

    private String planName;
    private Integer monthlyLimit;

    private Integer usedThisMonth;
    private Integer remaining;

    private String subscriptionStatus;
}
