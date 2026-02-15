package com.smartbiz.backend.entity;

import jakarta.persistence.*;
import lombok.Data;


import java.math.BigDecimal;

@Entity
@Table(name = "subscription_plans")
@Data
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // FREE, BASIC, PREMIUM

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyPrice;

    @Column(nullable = false)
    private Integer maxUsers;

    @Column(nullable = false)
    private Integer maxProducts;

    @Column(nullable = false)
    private Integer maxAiRequestsPerMonth;

    private Boolean active = true;
}
