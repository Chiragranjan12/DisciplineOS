package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.AuthRequestDTO;
import com.disciplineos.backend.dto.AuthResponseDTO;
import com.disciplineos.backend.dto.RegisterResponseDTO;
import com.disciplineos.backend.dto.RegisterRequestDTO;
import com.disciplineos.backend.dto.VerifyEmailRequestDTO;
import com.disciplineos.backend.entity.Role;
import com.disciplineos.backend.entity.User;
import com.disciplineos.backend.exception.EmailAlreadyExistsException;
import com.disciplineos.backend.exception.InvalidOtpException;
import com.disciplineos.backend.repository.RoleRepository;
import com.disciplineos.backend.repository.UserRepository;
import com.disciplineos.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final SecureRandom OTP_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${application.auth.otp.expiration-minutes:10}")
    private int otpExpirationMinutes;

    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user != null && user.isEmailVerified()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        String otp = generateOtp();
        String otpHash = passwordEncoder.encode(otp);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(otpExpirationMinutes);

        if (user == null) {
            user = User.builder()
                    .name(request.getName())
                    .email(normalizedEmail)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(userRole)
                    .emailVerified(false)
                    .verificationOtpHash(otpHash)
                    .verificationOtpExpiresAt(expiresAt)
                    .build();
        } else {
            user.setName(request.getName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(userRole);
            user.setEmailVerified(false);
            user.setVerificationOtpHash(otpHash);
            user.setVerificationOtpExpiresAt(expiresAt);
        }

        userRepository.save(user);
        emailService.sendRegistrationOtp(user.getEmail(), otp);

        return RegisterResponseDTO.builder()
                .email(user.getEmail())
                .message("Verification code sent to your email")
                .otpExpiresInMinutes(otpExpirationMinutes)
                .build();
    }

    @Transactional
    public AuthResponseDTO verifyEmail(VerifyEmailRequestDTO request) {
        User user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new InvalidOtpException("Invalid or expired verification code"));

        if (user.isEmailVerified()) {
            String jwtToken = jwtService.generateToken(user);
            return buildAuthResponse(user, jwtToken);
        }

        if (user.getVerificationOtpHash() == null ||
                user.getVerificationOtpExpiresAt() == null ||
                user.getVerificationOtpExpiresAt().isBefore(LocalDateTime.now()) ||
                !passwordEncoder.matches(request.getOtp(), user.getVerificationOtpHash())) {
            throw new InvalidOtpException("Invalid or expired verification code");
        }

        user.setEmailVerified(true);
        user.setVerificationOtpHash(null);
        user.setVerificationOtpExpiresAt(null);
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        return buildAuthResponse(user, jwtToken);
    }

    @Transactional
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new InvalidOtpException("Email not found"));

        if (user.isEmailVerified()) {
            throw new InvalidOtpException("Email already verified");
        }

        String otp = generateOtp();
        user.setVerificationOtpHash(passwordEncoder.encode(otp));
        user.setVerificationOtpExpiresAt(LocalDateTime.now().plusMinutes(otpExpirationMinutes));
        userRepository.save(user);

        emailService.sendRegistrationOtp(user.getEmail(), otp);
    }

    public AuthResponseDTO login(AuthRequestDTO request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()));

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow();

        String jwtToken = jwtService.generateToken(user);

        return AuthResponseDTO.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    private AuthResponseDTO buildAuthResponse(User user, String jwtToken) {
        return AuthResponseDTO.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    private String generateOtp() {
        return String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
