package com.smartbiz.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private BigDecimal unitPrice;
    private Integer stockQty;
    private Boolean active;
}
