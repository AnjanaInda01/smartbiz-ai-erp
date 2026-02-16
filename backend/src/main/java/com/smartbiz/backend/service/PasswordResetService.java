package com.smartbiz.backend.service;

public interface PasswordResetService {

    void sendOtp(String email);

    String verifyOtp(String email, String otp);

    void resetPassword(String email, String resetToken, String newPassword, String confirmPassword);
}
