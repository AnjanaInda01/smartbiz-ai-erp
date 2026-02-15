package com.smartbiz.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@AllArgsConstructor
public class SupplierProductResponse {
    private Long id;

    private Long supplierId;
    private String supplierName;

    private Long productId;
    private String productName;
    private String productSku;

    private BigDecimal costPrice;
    private boolean active;

    private Instant createdAt;
    private Instant updatedAt;
}
