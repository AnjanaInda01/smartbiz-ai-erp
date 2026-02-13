package com.smartbiz.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "businesses")
@Data
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String address;
}
