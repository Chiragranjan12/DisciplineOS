package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.AuthRequestDTO;
import com.disciplineos.backend.dto.AuthResponseDTO;
import com.disciplineos.backend.dto.RegisterResponseDTO;
import com.disciplineos.backend.dto.RegisterRequestDTO;
import com.disciplineos.backend.dto.VerifyEmailRequestDTO;
import com.disciplineos.backend.exception.InvalidOtpException;
import jakarta.validation.Valid;
import com.disciplineos.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration and login endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a pending user account and sends a verification OTP")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify registration OTP", description = "Activates a pending account and returns a JWT token")
    public ResponseEntity<AuthResponseDTO> verifyEmail(@Valid @RequestBody VerifyEmailRequestDTO request) {
        return ResponseEntity.ok(authService.verifyEmail(request));
    }

    @PostMapping("/resend-otp")
    @Operation(summary = "Resend registration OTP", description = "Sends a new OTP for a pending account")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        try {
            authService.resendOtp(email);
            return ResponseEntity.ok(Map.of("message", "OTP resent successfully"));
        } catch (InvalidOtpException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates user and returns a JWT token")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
