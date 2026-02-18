package com.smartbiz.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSubscriptionResponse {
    private Long id;
    private Long planId;
    private String planName;
    private BigDecimal price;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
}
