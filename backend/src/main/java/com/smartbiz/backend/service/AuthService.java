package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.LoginRequest;
import com.smartbiz.backend.dto.request.RegisterRequest;
import com.smartbiz.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
