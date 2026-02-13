package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.entity.User;
import com.smartbiz.backend.repository.UserRepository;
import com.smartbiz.backend.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImpl implements CurrentUserService {

    private final UserRepository userRepository;

    @Override
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + email));
    }

    @Override
    public Long getCurrentBusinessId() {
        User user = getCurrentUser();
        if (user.getBusiness() == null) {
            throw new RuntimeException("Business user required");
        }
        return user.getBusiness().getId();
    }
}
