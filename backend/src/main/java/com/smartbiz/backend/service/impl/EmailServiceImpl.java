package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SmartBiz ERP - Password Reset OTP");
        message.setText(
                "Hello,\n\n" +
                "Your OTP code is: " + otpCode + "\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "SmartBiz ERP"
        );
        mailSender.send(message);
    }

    @Override
    public void sendPasswordChangedEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SmartBiz ERP - Password Changed");
        message.setText(
                "Hello,\n\n" +
                "Your password has been changed successfully.\n" +
                "If this was not you, please contact support immediately.\n\n" +
                "SmartBiz ERP"
        );
        mailSender.send(message);
    }
}

