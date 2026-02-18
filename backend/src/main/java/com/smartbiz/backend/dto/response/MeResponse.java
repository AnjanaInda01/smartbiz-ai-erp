package com.smartbiz.backend.dto.response;

import com.smartbiz.backend.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MeResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Long businessId; // null for ADMIN
    private String businessName; // null for ADMIN
}
