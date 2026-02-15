package com.smartbiz.backend.dto.response;

import com.smartbiz.backend.enums.PurchaseStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class PurchaseResponse {
    private Long id;
    private String purchaseNo;
    private LocalDate purchaseDate;
    private PurchaseStatus status;
    private BigDecimal totalCost;
}
