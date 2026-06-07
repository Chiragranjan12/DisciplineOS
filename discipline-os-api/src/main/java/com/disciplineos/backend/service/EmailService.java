package com.disciplineos.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${application.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${application.mail.from:no-reply@disciplineos.local}")
    private String fromAddress;

    public void sendRegistrationOtp(String email, String otp) {
        if (!mailEnabled || mailSender == null) {
            log.info("Email sending is disabled. Registration OTP for {} is {}", email, otp);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email);
        message.setSubject("Verify your DisciplineOS email");
        message.setText("""
                Your DisciplineOS verification code is %s.

                This code expires in 10 minutes. If you did not request this, ignore this email.
                """.formatted(otp));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.error("Failed to send registration OTP to {}", email, ex);
        }
    }
}
