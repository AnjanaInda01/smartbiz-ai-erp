package com.smartbiz.backend.controller;

import com.smartbiz.backend.dto.request.AiInsightRequest;
import com.smartbiz.backend.dto.request.AiEmailRequest;
import com.smartbiz.backend.dto.request.AiSocialPostRequest;
import com.smartbiz.backend.dto.response.AiResponse;
import com.smartbiz.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/insight")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<AiResponse> generateInsight(@RequestBody AiInsightRequest request) {
        String response = aiService.generateBusinessInsight(request.getQuestion());
        return ResponseEntity.ok(new AiResponse(response));
    }

    @PostMapping("/email")
    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    public ResponseEntity<AiResponse> generateEmail(@RequestBody AiEmailRequest request) {
        String response = aiService.generateEmail(request.getPrompt());
        return ResponseEntity.ok(new AiResponse(response));
    }

    @PostMapping("/social-post")
    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    public ResponseEntity<AiResponse> generateSocialPost(@RequestBody AiSocialPostRequest request) {
        String response = aiService.generateSocialPost(request.getPrompt());
        return ResponseEntity.ok(new AiResponse(response));
    }

    @PostMapping("/invoice/{invoiceId}/summary")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<AiResponse> generateInvoiceSummary(@PathVariable Long invoiceId) {
        String response = aiService.generateInvoiceSummary(invoiceId);
        return ResponseEntity.ok(new AiResponse(response));
    }
}
