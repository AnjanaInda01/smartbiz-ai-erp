package com.smartbiz.backend.security;

import com.smartbiz.backend.repository.UserRepository;
import com.smartbiz.backend.repository.StaffRepository;
import com.smartbiz.backend.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        var user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (user.getRole() == Role.STAFF) {
            boolean active = staffRepository.findByUser_Email(username)
                    .map(staff -> staff.isActive())
                    .orElse(false);
            if (!active) {
                throw new UsernameNotFoundException("Staff account is disabled");
            }
        }

        return user;
    }
}
