package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.entity.AiRequest;
import com.smartbiz.backend.entity.Invoice;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.AiRequestRepository;
import com.smartbiz.backend.repository.InvoiceRepository;
import com.smartbiz.backend.service.AiService;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.SubscriptionAssignmentService;
import com.smartbiz.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AiServiceImpl implements AiService {

    private final AiRequestRepository aiRequestRepository;
    private final SubscriptionService subscriptionService;
    private final SubscriptionAssignmentService subscriptionAssignmentService;
    private final CurrentUserService currentUserService;
    private final InvoiceRepository invoiceRepository;

    @Override
    public String generateBusinessInsight(String question) {

        Long businessId = currentUserService.getCurrentBusinessId();

        checkAiLimit(businessId);

        String response = callOpenAi(question);

        saveRequest("INSIGHT", question, response);

        return response;
    }

    @Override
    public String generateEmail(String prompt) {

        Long businessId = currentUserService.getCurrentBusinessId();

        checkAiLimit(businessId);

        String response = callOpenAi(prompt);

        saveRequest("EMAIL", prompt, response);

        return response;
    }

    @Override
    public String generateInvoiceSummary(Long invoiceId) {

        Long businessId = currentUserService.getCurrentBusinessId();

        checkAiLimit(businessId);

        Invoice invoice = invoiceRepository
                .findByIdAndBusiness_Id(invoiceId, businessId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found"));

        String invoiceData = buildInvoiceSummaryText(invoice);

        String response = callOpenAi(
                "Explain this invoice in simple business terms:\n\n" + invoiceData
        );

        saveRequest("INVOICE_SUMMARY", invoiceData, response);

        return response;
    }

    @Override
    public String generateSocialPost(String prompt) {

        Long businessId = currentUserService.getCurrentBusinessId();

        checkAiLimit(businessId);

        String response = callOpenAi(prompt);

        saveRequest("SOCIAL_POST", prompt, response);

        return response;
    }

    // ==========================
    // 🔐 AI LIMIT CHECK
    // ==========================
    private void checkAiLimit(Long businessId) {
        try {
            LocalDate today = LocalDate.now();
            LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();
            LocalDateTime monthEnd = today
                    .withDayOfMonth(today.lengthOfMonth())
                    .atTime(23, 59, 59);

            int usedThisMonth =
                    aiRequestRepository.countByBusiness_IdAndCreatedAtBetween(
                            businessId,
                            monthStart,
                            monthEnd
                    );

            int maxAi =
                    subscriptionService
                            .getCurrentPlan(businessId)
                            .getMaxAiRequestsPerMonth();

            // Check limit only if maxAi is not unlimited (-1)
            if (maxAi != -1 && usedThisMonth >= maxAi) {
                throw new BadRequestException("AI usage limit reached for this month. Please upgrade your plan for more AI requests.");
            }
        } catch (BadRequestException e) {
            // Re-throw BadRequestException (limit reached)
            if (e.getMessage().contains("limit reached")) {
                throw e;
            }
            // If it's a "no subscription" error, the SubscriptionService will handle it
            throw e;
        }
    }

    // ==========================
    // 💾 SAVE AI REQUEST LOG
    // ==========================
    private void saveRequest(String type, String prompt, String response) {

        AiRequest req = new AiRequest();
        req.setBusiness(currentUserService.getCurrentUser().getBusiness());
        req.setUser(currentUserService.getCurrentUser());
        req.setType(type);
        req.setPrompt(prompt);
        req.setResponse(response);
        req.setSuccess(true);

        aiRequestRepository.save(req);
    }

    // ==========================
    // 📄 BUILD INVOICE TEXT
    // ==========================
    private String buildInvoiceSummaryText(Invoice invoice) {

        StringBuilder sb = new StringBuilder();

        sb.append("Invoice Number: ").append(invoice.getInvoiceNo()).append("\n");
        sb.append("Customer: ").append(invoice.getCustomer().getName()).append("\n");
        sb.append("Date: ").append(invoice.getInvoiceDate()).append("\n");
        sb.append("Items:\n");

        invoice.getItems().forEach(item -> {
            sb.append("- ")
                    .append(item.getProduct().getName())
                    .append(" x ")
                    .append(item.getQty())
                    .append(" = ")
                    .append(item.getLineTotal())
                    .append("\n");
        });

        sb.append("Grand Total: ").append(invoice.getGrandTotal());

        return sb.toString();
    }

    // ==========================
    // 🤖 PLACEHOLDER AI CALL
    // ==========================
    private String callOpenAi(String prompt) {

        // 🔥 Replace this later with real OpenAI API call

        return "AI Response for: " + prompt;
    }
}
