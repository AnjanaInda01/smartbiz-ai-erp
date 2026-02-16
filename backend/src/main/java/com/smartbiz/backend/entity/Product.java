package com.smartbiz.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false)
    private String  name;

    // optional unique per business (we'll check in service)
    private String  sku;

    @Column(nullable = false,precision =  10,scale=2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lastCostPrice = BigDecimal.ZERO;


    @Column(nullable = false)
    private Integer stockQty=0;

    private  Boolean active=true;

}
