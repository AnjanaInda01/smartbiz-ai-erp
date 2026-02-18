package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.response.AdminAiUsageResponse;
import com.smartbiz.backend.dto.response.SystemStatisticsResponse;
import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.repository.*;
import com.smartbiz.backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final BusinessSubscriptionRepository subscriptionRepository;
    private final AiRequestRepository aiRequestRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public List<AdminAiUsageResponse> getAiUsageSummary() {

        LocalDate today = LocalDate.now();
        LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd =
                today.withDayOfMonth(today.lengthOfMonth())
                        .atTime(23, 59, 59);

        return subscriptionRepository.findAllActive()
                .stream()
                // 🔥 Only PRO plans (price > 0)
                .filter(sub -> sub.getPlan().getMonthlyPrice().doubleValue() > 0)
                .map(sub -> {

                    Long businessId = sub.getBusiness().getId();

                    int used =
                            aiRequestRepository.countMonthlyUsage(
                                    businessId,
                                    monthStart,
                                    monthEnd
                            );

                    int limit = sub.getPlan().getMaxAiRequestsPerMonth();

                    return AdminAiUsageResponse.builder()
                            .businessId(businessId)
                            .businessName(sub.getBusiness().getName())
                            .planName(sub.getPlan().getName())
                            .monthlyLimit(limit)
                            .usedThisMonth(used)
                            .remaining(limit - used)
                            .subscriptionStatus(sub.getStatus().name())
                            .build();
                })
                .toList();
    }

    @Override
    public SystemStatisticsResponse getSystemStatistics() {
        long totalBusinesses = businessRepository.count();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalCustomers = customerRepository.count();
        long totalInvoices = invoiceRepository.count();
        long totalAiRequests = aiRequestRepository.count();
        long activeSubscriptions = subscriptionRepository.findAllActive().size();

        return SystemStatisticsResponse.builder()
                .totalBusinesses(totalBusinesses)
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalCustomers(totalCustomers)
                .totalInvoices(totalInvoices)
                .totalAiRequests(totalAiRequests)
                .activeSubscriptions(activeSubscriptions)
                .build();
    }
}
