ALTER TABLE users
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN verification_otp_hash VARCHAR(255),
    ADD COLUMN verification_otp_expires_at TIMESTAMP;
