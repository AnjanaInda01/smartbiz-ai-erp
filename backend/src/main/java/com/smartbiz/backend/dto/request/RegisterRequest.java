package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String businessName;

    @Email @NotBlank
    private String businessEmail;

    @NotBlank
    private String ownerName;

    @Email @NotBlank
    private String ownerEmail;

    @NotBlank
    private String password;
}
