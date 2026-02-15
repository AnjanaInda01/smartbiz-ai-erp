package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SupplierProductUpdateRequest {
    @Positive(message = "Cost price must be greater than 0")
    private BigDecimal costPrice;

    private Boolean active;
}
