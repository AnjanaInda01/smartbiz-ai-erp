package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SupplierProductCreateRequest {
    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Cost price is required")
    @Positive(message = "Cost price must be greater than 0")
    private BigDecimal costPrice;
}
