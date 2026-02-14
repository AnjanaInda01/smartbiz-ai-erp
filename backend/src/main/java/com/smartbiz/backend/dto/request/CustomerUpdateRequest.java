package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerUpdateRequest {
    @NotBlank(message = "Customer name is required")
    @Size(max = 120, message = "Customer name max 120 characters")
    private String name;

    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email max 150 characters")
    private String email;

    @Size(max = 30, message = "Phone max 30 characters")
    private String phone;

    private Boolean active;
}
