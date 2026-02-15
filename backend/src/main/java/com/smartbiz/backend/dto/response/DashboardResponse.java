package com.smartbiz.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class DashboardResponse {
    private BigDecimal todaySales;
    private BigDecimal monthSales;
    private long totalCustomers;
    private long totalProducts;
    private List<LowStockProduct> lowStockProducts;

    @Getter
    @Builder
    public static class LowStockProduct {
        private Long id;
        private String name;
        private String sku;
        private Integer stockQty;
    }
}
