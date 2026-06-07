package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.AuthRequestDTO;
import com.disciplineos.backend.dto.AuthResponseDTO;
import com.disciplineos.backend.dto.RegisterRequestDTO;
import com.disciplineos.backend.entity.Role;
import com.disciplineos.backend.entity.User;
import com.disciplineos.backend.exception.EmailAlreadyExistsException;
import com.disciplineos.backend.repository.RoleRepository;
import com.disciplineos.backend.repository.UserRepository;
import com.disciplineos.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = User.builder()
                .name(request.getName())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .emailVerified(true)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return AuthResponseDTO.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    public AuthResponseDTO login(AuthRequestDTO request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword()));

        User user = userRepository.findByEmail(normalizedEmail).orElseThrow();

        String token = jwtService.generateToken(user);
        return AuthResponseDTO.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
