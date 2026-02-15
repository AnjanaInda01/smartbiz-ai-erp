package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.LoginRequest;
import com.smartbiz.backend.dto.request.RegisterRequest;
import com.smartbiz.backend.dto.response.AuthResponse;
import com.smartbiz.backend.dto.response.MeResponse;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.service.AuthService;
import com.smartbiz.backend.service.CurrentUserService;
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
                .build());
    }
}
