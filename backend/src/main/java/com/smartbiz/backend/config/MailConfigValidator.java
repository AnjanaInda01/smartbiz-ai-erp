package com.smartbiz.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MailConfigValidator {

    @Value("${app.mail.required:true}")
    private boolean mailRequired;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.port:}")
    private String mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.from:}")
    private String mailFrom;

    @PostConstruct
    public void validateMailConfig() {
        if (!mailRequired) {
            return;
        }

        List<String> missing = new ArrayList<>();

        if (isBlank(mailHost)) {
            missing.add("MAIL_HOST (spring.mail.host)");
        }
        if (isBlank(mailPort)) {
            missing.add("MAIL_PORT (spring.mail.port)");
        }
        if (isBlank(mailUsername)) {
            missing.add("MAIL_USERNAME (spring.mail.username)");
        }
        if (isBlank(mailPassword)) {
            missing.add("MAIL_PASSWORD (spring.mail.password)");
        }
        if (isBlank(mailFrom)) {
            missing.add("MAIL_FROM (app.mail.from)");
        }

        if (!missing.isEmpty()) {
            throw new IllegalStateException(
                    "Mail configuration is incomplete. Missing: " + String.join(", ", missing) +
                    ". Set these environment variables in IntelliJ Run Configuration. " +
                    "If you want to run without email temporarily, set app.mail.required=false."
            );
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

