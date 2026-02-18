package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.LoginRequest;
import com.smartbiz.backend.dto.request.RegisterRequest;
import com.smartbiz.backend.dto.response.AuthResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.BusinessSubscription;
import com.smartbiz.backend.entity.SubscriptionPlan;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import com.smartbiz.backend.enums.SubscriptionStatus;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.BusinessSubscriptionRepository;
import com.smartbiz.backend.repository.SubscriptionPlanRepository;
import com.smartbiz.backend.repository.UserRepository;
import com.smartbiz.backend.security.JwtService;
import com.smartbiz.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final BusinessSubscriptionRepository businessSubscriptionRepository;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getOwnerEmail())) {
            throw new ConflictException("Email already registered");
        }

        Business business = new Business();
        business.setName(request.getBusinessName());
        business.setEmail(request.getBusinessEmail());
        business = businessRepository.save(business);

        User owner = new User();
        owner.setName(request.getOwnerName());
        owner.setEmail(request.getOwnerEmail());
        owner.setPassword(passwordEncoder.encode(request.getPassword()));
        owner.setRole(Role.OWNER);
        owner.setBusiness(business);
        owner = (User) userRepository.save(owner);

        // Automatically assign FREE plan to new business
        assignFreePlanToBusiness(business.getId());

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", owner.getRole().name());
        claims.put("businessId", business.getId());
        String token = jwtService.generateToken(owner.getEmail(), claims);

        return new AuthResponse(token, owner.getRole(), business.getId(), owner.getName(), owner.getEmail());
    }

    private void assignFreePlanToBusiness(Long businessId) {
        // Check if business already has an active subscription
        if (businessSubscriptionRepository
                .findByBusiness_IdAndStatus(businessId, SubscriptionStatus.ACTIVE)
                .isPresent()) {
            return; // Business already has an active subscription
        }

        // Find FREE plan (name = "FREE" or price = 0)
        SubscriptionPlan freePlan = subscriptionPlanRepository.findAll().stream()
                .filter(plan -> plan.getActive() != null && plan.getActive() &&
                               ("FREE".equalsIgnoreCase(plan.getName()) || 
                                plan.getMonthlyPrice().doubleValue() == 0))
                .findFirst()
                .orElse(null);

        if (freePlan != null) {
            BusinessSubscription subscription = new BusinessSubscription();
            subscription.setBusiness(businessRepository.findById(businessId).orElseThrow());
            subscription.setPlan(freePlan);
            subscription.setStartDate(LocalDate.now());
            subscription.setStatus(SubscriptionStatus.ACTIVE);
            // Set end date to 1 year from now
            subscription.setEndDate(LocalDate.now().plusYears(1));
            businessSubscriptionRepository.save(subscription);
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        Long businessId = (user.getBusiness() != null) ? user.getBusiness().getId() : null;

        // Build claims map - handle null businessId for admin users
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        if (businessId != null) {
            claims.put("businessId", businessId);
        }

        String token = jwtService.generateToken(user.getEmail(), claims);

        return new AuthResponse(token, user.getRole(), businessId, user.getName(), user.getEmail());
    }
}
