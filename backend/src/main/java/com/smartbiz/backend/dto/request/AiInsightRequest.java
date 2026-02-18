package com.smartbiz.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiInsightRequest {
    @NotBlank(message = "Question is required")
    private String question;
}
