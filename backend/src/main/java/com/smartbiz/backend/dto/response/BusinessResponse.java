package com.smartbiz.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String subscriptionPlan; // FREE, PRO, or null
    private String subscriptionStatus; // ACTIVE, EXPIRED, etc.
}
