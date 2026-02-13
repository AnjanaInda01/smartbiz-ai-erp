package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.LoginRequest;
import com.smartbiz.backend.dto.request.RegisterRequest;
import com.smartbiz.backend.dto.response.AuthResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.UserRepository;
import com.smartbiz.backend.security.JwtService;
import com.smartbiz.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getOwnerEmail())) {
            throw new RuntimeException("Email already registered");
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

        String token = jwtService.generateToken(
                owner.getEmail(),
                Map.of("role", owner.getRole().name(), "businessId", business.getId())
        );

        return new AuthResponse(token, owner.getRole(), business.getId(), owner.getName(), owner.getEmail());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        Long businessId = (user.getBusiness() != null) ? user.getBusiness().getId() : null;

        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of("role", user.getRole().name(), "businessId", businessId)
        );

        return new AuthResponse(token, user.getRole(), businessId, user.getName(), user.getEmail());
    }
}
