package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.entity.PasswordResetOtp;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.repository.PasswordResetOtpRepository;
import com.smartbiz.backend.repository.UserRepository;
import com.smartbiz.backend.service.EmailService;
import com.smartbiz.backend.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public void sendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElse(null);

        // Security: do not reveal user existence
        if (user == null) return;

        // Real-world behavior: invalidate previous unused OTPs before issuing a new one
        List<PasswordResetOtp> activeOtps = otpRepository.findAllByUserAndUsedFalse(user);
        if (!activeOtps.isEmpty()) {
            activeOtps.forEach(otp -> otp.setUsed(true));
            otpRepository.saveAll(activeOtps);
        }

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));

        PasswordResetOtp entity = PasswordResetOtp.builder()
                .user(user)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .used(false)
                .build();

        otpRepository.save(entity);

        String role = user.getRole() != null ? user.getRole().name() : null;
        String businessName = user.getBusiness() != null ? user.getBusiness().getName() : null;
        emailService.sendOtpEmail(email, user.getName(), role, businessName, otp);
    }

    @Override
    public String verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email"));

        PasswordResetOtp entity = otpRepository
                .findTopByUserAndUsedFalseOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new BadRequestException("OTP not found"));

        if (entity.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("OTP expired");
        }

        if (!passwordEncoder.matches(otp, entity.getOtpHash())) {
            throw new BadRequestException("Invalid OTP");
        }

        entity.setVerifiedAt(Instant.now());

        String resetToken = UUID.randomUUID().toString();

        entity.setResetTokenHash(passwordEncoder.encode(resetToken));

        otpRepository.save(entity);

        return resetToken;
    }

    @Override
    public void resetPassword(String email, String resetToken, String newPassword, String confirmPassword) {

        if (!newPassword.equals(confirmPassword)) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email"));

        PasswordResetOtp entity = otpRepository
                .findTopByUserAndUsedFalseOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new BadRequestException("Invalid reset session"));

        if (entity.getVerifiedAt() == null) {
            throw new BadRequestException("OTP not verified");
        }

        if (!passwordEncoder.matches(resetToken, entity.getResetTokenHash())) {
            throw new BadRequestException("Invalid reset token");
        }

        if (entity.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Reset session expired. Please request a new OTP.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        entity.setUsed(true);

        userRepository.save(user);
        otpRepository.save(entity);
        String role = user.getRole() != null ? user.getRole().name() : null;
        String businessName = user.getBusiness() != null ? user.getBusiness().getName() : null;
        emailService.sendPasswordChangedEmail(email, user.getName(), role, businessName);
    }
}
