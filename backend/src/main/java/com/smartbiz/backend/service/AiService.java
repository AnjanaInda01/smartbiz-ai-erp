package com.smartbiz.backend.service;

public interface AiService {
    String generateBusinessInsight(String question);

    String generateEmail(String prompt);

    String generateInvoiceSummary(Long invoiceId);

    String generateSocialPost(String prompt);
}
