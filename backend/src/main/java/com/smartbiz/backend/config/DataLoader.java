package com.smartbiz.backend.config;

import com.smartbiz.backend.entity.SubscriptionPlan;
import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.enums.Role;
import com.smartbiz.backend.repository.SubscriptionPlanRepository;
import com.smartbiz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

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

        // Create default FREE plan if it doesn't exist
        if (!subscriptionPlanRepository.findByName("FREE").isPresent()) {
            SubscriptionPlan freePlan = new SubscriptionPlan();
            freePlan.setName("FREE");
            freePlan.setMonthlyPrice(BigDecimal.ZERO);
            freePlan.setMaxUsers(2);
            freePlan.setMaxProducts(50);
            freePlan.setMaxAiRequestsPerMonth(10);
            freePlan.setActive(true);
            subscriptionPlanRepository.save(freePlan);
            System.out.println("✅ Default FREE subscription plan created");
        }

        // Create default PRO plan if it doesn't exist
        if (!subscriptionPlanRepository.findByName("PRO").isPresent()) {
            SubscriptionPlan proPlan = new SubscriptionPlan();
            proPlan.setName("PRO");
            proPlan.setMonthlyPrice(new BigDecimal("29.99"));
            proPlan.setMaxUsers(-1); // Unlimited
            proPlan.setMaxProducts(-1); // Unlimited
            proPlan.setMaxAiRequestsPerMonth(1000);
            proPlan.setActive(true);
            subscriptionPlanRepository.save(proPlan);
            System.out.println("✅ Default PRO subscription plan created");
        }
    }
}
