package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StaffUpdateRequest {

    @Size(max = 120, message = "Name must not exceed 120 characters")
    private String name;

    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Size(max = 30, message = "Phone must not exceed 30 characters")
    private String phone;

    private Boolean active;
}
