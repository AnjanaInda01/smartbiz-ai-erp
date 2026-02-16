package com.smartbiz.backend.dto.response;

public record VerifyOtpResponse(
        String resetToken,
        String message
) {}
