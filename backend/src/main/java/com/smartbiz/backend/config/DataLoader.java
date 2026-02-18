package com.smartbiz.backend.config;

import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import com.smartbiz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@smartbiz.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@smartbiz.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Default password
            admin.setRole(Role.ADMIN);
            admin.setBusiness(null); // Admin users don't have a business
            userRepository.save(admin);
            System.out.println("✅ Default admin user created:");
            System.out.println("   Email: admin@smartbiz.com");
            System.out.println("   Password: admin123");
        }
    }
}
