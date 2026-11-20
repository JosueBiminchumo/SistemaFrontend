package com.mediturno.backend.auth.service;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Optional;

import com.mediturno.backend.user.domain.User;
import com.mediturno.backend.user.domain.UserRole;
import com.mediturno.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(name = "app.bootstrap-admin.enabled", havingValue = "true")
public class BootstrapAdminRunner implements ApplicationRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(BootstrapAdminRunner.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String password;

    public BootstrapAdminRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-admin.first-name:}") String firstName,
            @Value("${app.bootstrap-admin.last-name:}") String lastName,
            @Value("${app.bootstrap-admin.email:}") String email,
            @Value("${app.bootstrap-admin.password:}") String password) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        validateConfiguration(normalizedEmail);

        Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);
        if (existingUser.isPresent()) {
            if (existingUser.get().getRole() != UserRole.ADMIN || !existingUser.get().isActive()) {
                throw new IllegalStateException(
                        "Bootstrap admin email is already assigned to an account that is not an active administrator.");
            }
            LOGGER.info("Bootstrap administrator already exists; no account changes were made.");
            return;
        }

        User administrator = User.create(
                firstName.trim(),
                lastName.trim(),
                normalizedEmail,
                passwordEncoder.encode(password),
                UserRole.ADMIN,
                true);
        userRepository.saveAndFlush(administrator);
        LOGGER.info("Bootstrap administrator account created in the users table.");
    }

    private void validateConfiguration(String normalizedEmail) {
        if (firstName.isBlank() || firstName.length() > 80
                || lastName.isBlank() || lastName.length() > 100) {
            throw new IllegalStateException(
                    "Bootstrap admin first and last names are required and must fit the user table.");
        }
        if (normalizedEmail.length() > 254
                || !normalizedEmail.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new IllegalStateException("A valid bootstrap admin email is required.");
        }
        if (password.length() < 8 || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalStateException("Bootstrap admin password must contain between 8 and 72 characters.");
        }
    }
}
