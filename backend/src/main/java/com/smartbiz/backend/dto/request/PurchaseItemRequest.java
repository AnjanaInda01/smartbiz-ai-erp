package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PurchaseItemRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Qty is required")
    @Positive(message = "Qty must be > 0")
    private Integer qty;

    @NotNull(message = "Cost price is required")
    @Positive(message = "Cost price must be > 0")
    private BigDecimal costPrice;
}
