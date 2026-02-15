package com.smartbiz.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class InvoiceCreateRequest {

    @NotNull(message = "customerId is required")
    private Long customerId;

    @NotNull(message = "invoiceDate is required")
    private LocalDate invoiceDate;

    @NotNull(message = "discount is required")
    @DecimalMin(value = "0.00", message = "discount must be >= 0")
    private BigDecimal discount;

    @NotEmpty(message = "items are required")
    private List<@Valid Item> items;

    @Getter
    @Setter
    public static class Item {
        @NotNull(message = "productId is required")
        private Long productId;

        @NotNull(message = "qty is required")
        @Min(value = 1, message = "qty must be >= 1")
        private Integer qty;
    }
}
