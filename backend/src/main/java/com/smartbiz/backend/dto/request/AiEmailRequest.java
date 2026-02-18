package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiEmailRequest {
    @NotBlank(message = "Prompt is required")
    private String prompt;
}
