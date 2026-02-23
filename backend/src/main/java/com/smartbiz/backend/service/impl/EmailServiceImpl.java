package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.password:}")
    private String smtpPassword;

    @Override
    public void sendOtpEmail(String toEmail, String recipientName, String role, String businessName, String otpCode) {
        if (!isMailConfigured()) {
            throw new BadRequestException("Email service is not configured. Set MAIL_USERNAME and MAIL_PASSWORD in backend environment variables.");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            String from = resolveFromAddress();
            if (from != null) {
                message.setFrom(from);
            }
            message.setTo(toEmail);
            message.setSubject("SmartBiz ERP - OTP to reset your password");
            message.setText(
                    "Hi " + safeName(recipientName) + ",\n\n" +
                    "We received a password reset request for your " + normalizeRole(role) + " account" +
                    (businessName != null && !businessName.isBlank() ? " in " + businessName : "") + ".\n\n" +
                    "Your OTP code is: " + otpCode + "\n" +
                    "This code will expire in 10 minutes.\n\n" +
                    "If you did not request this, you can safely ignore this email.\n\n" +
                    "SmartBiz ERP"
            );
            mailSender.send(message);
        } catch (MailException e) {
            throw new BadRequestException("Could not send email. Check SMTP settings and app password.");
        }
    }

    @Override
    public void sendPasswordChangedEmail(String toEmail, String recipientName, String role, String businessName) {
        if (!isMailConfigured()) {
            throw new BadRequestException("Email service is not configured. Set MAIL_USERNAME and MAIL_PASSWORD in backend environment variables.");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            String from = resolveFromAddress();
            if (from != null) {
                message.setFrom(from);
            }
            message.setTo(toEmail);
            message.setSubject("SmartBiz ERP - Password changed successfully");
            message.setText(
                    "Hi " + safeName(recipientName) + ",\n\n" +
                    "Your password has been changed successfully for your " + normalizeRole(role) + " account" +
                    (businessName != null && !businessName.isBlank() ? " in " + businessName : "") + ".\n\n" +
                    "If this was not you, please contact support immediately and reset your password again.\n\n" +
                    "SmartBiz ERP"
            );
            mailSender.send(message);
        } catch (MailException e) {
            throw new BadRequestException("Could not send email. Check SMTP settings and app password.");
        }
    }

    private String resolveFromAddress() {
        if (fromEmail != null && !fromEmail.isBlank()) {
            return fromEmail;
        }
        if (smtpUsername != null && !smtpUsername.isBlank()) {
            return smtpUsername;
        }
        return null;
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "user";
        }
        return role.toLowerCase();
    }

    private String safeName(String recipientName) {
        return (recipientName == null || recipientName.isBlank()) ? "there" : recipientName;
    }

    private boolean isMailConfigured() {
        return smtpUsername != null
                && !smtpUsername.isBlank()
                && smtpPassword != null
                && !smtpPassword.isBlank()
                && mailSender != null;
    }
}

