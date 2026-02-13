package com.smartbiz.backend.dto.response;

import com.smartbiz.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private Role role;
    private Long businessId;
    private String name;
    private String email;
}
