package com.smartbiz.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_requests",
        indexes = {
                @Index(name="idx_ai_business", columnList = "business_id"),
                @Index(name="idx_ai_created", columnList = "createdAt")
        })
@Data
public class AiRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Business business;

    @ManyToOne(optional = false)
    private User user;

    @Column(nullable = false)
    private String type; // INSIGHT, EMAIL, INVOICE, SOCIAL

    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String response;

    private Boolean success;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
