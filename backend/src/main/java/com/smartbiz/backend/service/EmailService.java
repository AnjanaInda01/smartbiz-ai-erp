package com.smartbiz.backend.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otpCode);

    void sendPasswordChangedEmail(String toEmail);
}

