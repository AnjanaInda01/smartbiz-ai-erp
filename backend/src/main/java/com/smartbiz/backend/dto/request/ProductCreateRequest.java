package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String sku;

    @NotNull(message = "Unit price is required")
    @Min(value = 0, message = "Unit price must be >= 0")
    private BigDecimal unitPrice;

    @Min(value = 0, message = "Cost price must be >= 0")
    private BigDecimal costPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock qty must be >= 0")
    private Integer stockQty;
}
