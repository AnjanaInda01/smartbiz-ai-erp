package com.smartbiz.backend.dto.response;

import com.smartbiz.backend.enums.InvoiceStatus;
import com.smartbiz.backend.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
public class InvoiceResponse {
    private Long id;
    private String invoiceNo;
    private LocalDate invoiceDate;

    private Long customerId;
    private String customerName;

    private InvoiceStatus status;

    private BigDecimal subTotal;
    private BigDecimal discount;
    private BigDecimal grandTotal;

    private PaymentStatus paymentStatus;
    private BigDecimal paidAmount;

    private List<Item> items;

    @Getter
    @Setter
    @Builder
    public static class Item {
        private Long productId;
        private String productName;
        private String sku;
        private Integer qty;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }
}
