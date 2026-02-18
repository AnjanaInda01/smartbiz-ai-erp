package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.*;
import com.smartbiz.backend.dto.response.AuthResponse;
import com.smartbiz.backend.dto.response.MeResponse;
import com.smartbiz.backend.dto.response.MessageResponse;
import com.smartbiz.backend.dto.response.VerifyOtpResponse;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.service.AuthService;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final CurrentUserService currentUserService;
    private final PasswordResetService passwordResetService;


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // existing register/login...

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MeResponse> me() {
        User u = currentUserService.getCurrentUser();
        return ResponseEntity.ok(MeResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .businessId(u.getBusiness() != null ? u.getBusiness().getId() : null)
                .businessName(u.getBusiness() != null ? u.getBusiness().getName() : null)
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.sendOtp(request.email());

        return ResponseEntity.ok(
                new MessageResponse("If the email exists, OTP has been sent."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        String resetToken =
                passwordResetService.verifyOtp(request.email(), request.otp());

        return ResponseEntity.ok(
                new VerifyOtpResponse(resetToken, "OTP verified"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(
                request.email(),
                request.resetToken(),
                request.newPassword(),
                request.confirmPassword()
        );

        return ResponseEntity.ok(
                new MessageResponse("Password updated successfully"));
    }

}
