package com.mediturno.backend.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.mediturno.backend.user.domain.User;
import com.mediturno.backend.user.domain.UserRole;
import com.mediturno.backend.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class BootstrapAdminRunnerTest {

    private static final String EMAIL = "admin@example.test";
    private static final String PASSWORD = "temporary-test-password";

    @Mock
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder;
    private AutoCloseable mocks;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void createsActiveAdminWithEncodedPasswordWhenEmailIsUnused() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());
        BootstrapAdminRunner runner = runner("Admin@Example.test", PASSWORD);

        runner.run(null);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).saveAndFlush(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getRole()).isEqualTo(UserRole.ADMIN);
        assertThat(savedUser.isActive()).isTrue();
        assertThat(savedUser.getEmail()).isEqualTo(EMAIL);
        assertThat(passwordEncoder.matches(PASSWORD, savedUser.getPasswordHash())).isTrue();
    }

    @Test
    void doesNotChangeAnExistingActiveAdmin() {
        User existingAdmin = User.create("Admin", "Existing", EMAIL, "existing-hash", UserRole.ADMIN, true);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(existingAdmin));

        runner(EMAIL, PASSWORD).run(null);

        verify(userRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any(User.class));
    }

    @Test
    void refusesToUseAnEmailAssignedToAnotherRole() {
        User patient = User.createPatient("Pat", "Test", EMAIL, "existing-hash");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(patient));

        assertThatThrownBy(() -> runner(EMAIL, PASSWORD).run(null))
                .isInstanceOf(IllegalStateException.class);
        verify(userRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any(User.class));
    }

    @Test
    void rejectsMissingOrTooShortBootstrapPassword() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> runner(EMAIL, "short").run(null))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("password");
        verify(userRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any(User.class));
    }

    private BootstrapAdminRunner runner(String email, String password) {
        return new BootstrapAdminRunner(
                userRepository,
                passwordEncoder,
                "Test",
                "Administrator",
                email,
                password);
    }
}
