package com.smartbiz.backend.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String recipientName, String role, String businessName, String otpCode);

    void sendPasswordChangedEmail(String toEmail, String recipientName, String role, String businessName);
}

