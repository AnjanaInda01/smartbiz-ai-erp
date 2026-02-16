package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.InvoiceCreateRequest;
import com.smartbiz.backend.dto.response.InvoiceResponse;
import com.smartbiz.backend.entity.*;
import com.smartbiz.backend.enums.InvoiceStatus;
import com.smartbiz.backend.enums.PaymentStatus;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.*;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceItemRepository invoiceItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final BusinessRepository businessRepository;
    private final CurrentUserService currentUserService;

    @Override
    public InvoiceResponse createDraft(InvoiceCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));

        Customer customer = customerRepository.findByIdAndBusiness_Id(request.getCustomerId(), businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.getCustomerId()));

        Invoice invoice = Invoice.builder()
                .business(business)
                .customer(customer)
                .invoiceDate(request.getInvoiceDate() != null ? request.getInvoiceDate() : LocalDate.now())
                .invoiceNo(generateInvoiceNo(businessId, request.getInvoiceDate()))
                .status(InvoiceStatus.DRAFT)
                .discount(nz(request.getDiscount()))
                .paymentStatus(PaymentStatus.UNPAID)
                .paidAmount(BigDecimal.ZERO)
                .active(true)
                .build();

        BigDecimal subTotal = BigDecimal.ZERO;

        for (InvoiceCreateRequest.Item itemReq : request.getItems()) {
            Product product = productRepository.findByIdAndBusiness_Id(itemReq.getProductId(), businessId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

            if (Boolean.FALSE.equals(product.getActive())) {
                throw new BadRequestException("Product is inactive: " + product.getId());
            }

            BigDecimal unitPrice = product.getUnitPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQty()));
            BigDecimal costPrice = product.getLastCostPrice() == null
                    ? BigDecimal.ZERO
                    : product.getLastCostPrice();

            InvoiceItem item = InvoiceItem.builder()
                    .product(product)
                    .qty(itemReq.getQty())
                    .costPrice(costPrice)
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build();

            invoice.addItem(item);
            subTotal = subTotal.add(lineTotal);
        }

        if (invoice.getDiscount().compareTo(subTotal) > 0) {
            throw new BadRequestException("Discount cannot be greater than subtotal");
        }

        invoice.setSubTotal(subTotal);
        invoice.setGrandTotal(subTotal.subtract(invoice.getDiscount()));

        Invoice saved = invoiceRepository.save(invoice);
        return toResponse(saved);
    }

    @Override
    public InvoiceResponse confirm(Long invoiceId) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Invoice invoice = invoiceRepository.findByIdAndBusiness_Id(invoiceId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        if (invoice.getStatus() == InvoiceStatus.CONFIRMED) return toResponse(invoice);
        if (invoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new BadRequestException("Cancelled invoice cannot be confirmed");
        }

        // Stock OUT happens here (professional)
        List<InvoiceItem> items = invoiceItemRepository.findAllByInvoice_Id(invoice.getId());
        for (InvoiceItem item : items) {
            Product product = productRepository.findByIdAndBusiness_Id(item.getProduct().getId(), businessId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.getProduct().getId()));

            int newQty = product.getStockQty() - item.getQty();
            if (newQty < 0) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            product.setStockQty(newQty);
            productRepository.save(product);
        }

        invoice.setStatus(InvoiceStatus.CONFIRMED);
        Invoice saved = invoiceRepository.save(invoice);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getById(Long invoiceId) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Invoice invoice = invoiceRepository.findByIdAndBusiness_Id(invoiceId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        return toResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> list() {
        Long businessId = currentUserService.getCurrentBusinessId();
        return invoiceRepository.findAllByBusiness_IdOrderByIdDesc(businessId)
                .stream().map(this::toResponse).toList();
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNo(invoice.getInvoiceNo())
                .invoiceDate(invoice.getInvoiceDate())
                .customerId(invoice.getCustomer().getId())
                .customerName(invoice.getCustomer().getName())
                .status(invoice.getStatus())
                .subTotal(invoice.getSubTotal())
                .discount(invoice.getDiscount())
                .grandTotal(invoice.getGrandTotal())
                .paymentStatus(invoice.getPaymentStatus())
                .paidAmount(invoice.getPaidAmount())
                .items(invoice.getItems().stream().map(it ->
                        InvoiceResponse.Item.builder()
                                .productId(it.getProduct().getId())
                                .productName(it.getProduct().getName())
                                .sku(it.getProduct().getSku())
                                .qty(it.getQty())
                                .unitPrice(it.getUnitPrice())
                                .lineTotal(it.getLineTotal())
                                .build()
                ).toList())
                .build();
    }

    private String generateInvoiceNo(Long businessId, LocalDate date) {
        LocalDate d = (date != null) ? date : LocalDate.now();
        long seq = invoiceRepository.countByBusiness_IdAndInvoiceDate(businessId, d) + 1;
        return "INV-" + d.toString().replace("-", "") + "-" + String.format("%04d", seq);
    }

    private BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
