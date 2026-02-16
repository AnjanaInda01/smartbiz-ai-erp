package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.response.DashboardResponse;
import com.smartbiz.backend.repository.CustomerRepository;
import com.smartbiz.backend.repository.InvoiceRepository;
import com.smartbiz.backend.repository.ProductRepository;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    @Override
    public DashboardResponse dashboard() {
        Long businessId = currentUserService.getCurrentBusinessId();

        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        var todaySales = invoiceRepository.sumSalesForDate(businessId, today);
        var monthSales = invoiceRepository.sumSalesBetween(businessId, monthStart, monthEnd);
        var todayProfit = invoiceRepository.calculateProfitForDate(businessId, today);
        var monthProfit = invoiceRepository.calculateProfitBetween(businessId, monthStart, monthEnd);

        long totalCustomers = customerRepository.countByBusiness_Id(businessId);
        long totalProducts = productRepository.countByBusiness_Id(businessId);

        var lowStock = productRepository.findAllByBusiness_IdAndStockQtyLessThan(businessId, 10)
                .stream()
                .map(p -> DashboardResponse.LowStockProduct.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .sku(p.getSku())
                        .stockQty(p.getStockQty())
                        .build())
                .toList();

        return DashboardResponse.builder()
                .todaySales(todaySales)
                .monthSales(monthSales)
                .todayProfit(todayProfit)
                .monthProfit(monthProfit)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .lowStockProducts(lowStock)
                .build();
    }
}
