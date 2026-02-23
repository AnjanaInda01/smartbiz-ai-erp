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
import java.util.Base64;
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

        String otp = String.format("%06d", secureRandom.nextInt(999999));

        PasswordResetOtp entity = PasswordResetOtp.builder()
                .user(user)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .used(false)
                .build();

        otpRepository.save(entity);

        emailService.sendOtpEmail(email, otp);
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

        user.setPassword(passwordEncoder.encode(newPassword));
        entity.setUsed(true);

        userRepository.save(user);
        otpRepository.save(entity);
        emailService.sendPasswordChangedEmail(email);
    }
}
