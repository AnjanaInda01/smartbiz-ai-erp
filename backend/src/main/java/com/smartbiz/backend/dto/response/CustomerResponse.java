package com.smartbiz.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}
