package com.vedas.service;

import com.vedas.model.UserAccount;
import com.vedas.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    public record OtpRequestResult(String accountKey, String message, String devOtpPreview) {}
    public record AuthSessionResult(String accountKey, String displayName, String sessionToken, boolean verified) {}

    private static final SecureRandom RANDOM = new SecureRandom();
    private final UserAccountRepository repo;
    private final boolean devTestingEnabled;

    public AuthService(
            UserAccountRepository repo,
            @Value("${vedas.subscription.dev-testing-enabled:true}") boolean devTestingEnabled) {
        this.repo = repo;
        this.devTestingEnabled = devTestingEnabled;
    }

    public OtpRequestResult requestOtp(String rawKey, String displayName) {
        String key = normalizeKey(rawKey);
        String otp = String.format("%06d", RANDOM.nextInt(1_000_000));

        UserAccount user = repo.findByAccountKeyIgnoreCase(key).orElseGet(UserAccount::new);
        user.setAccountKey(key);
        if (displayName != null && !displayName.isBlank()) {
            user.setDisplayName(displayName.trim());
        }
        user.setPendingOtp(otp);
        user.setOtpExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));
        user.setUpdatedAt(Instant.now());
        repo.save(user);

        String preview = devTestingEnabled ? otp : null;
        String msg = devTestingEnabled
                ? "OTP generated (Dev Testing preview included)."
                : "OTP sent to " + key;
        return new OtpRequestResult(key, msg, preview);
    }

    public AuthSessionResult verifyOtp(String rawKey, String otp) {
        String key = normalizeKey(rawKey);
        if (otp == null || otp.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP is required");
        }
        UserAccount user = repo.findByAccountKeyIgnoreCase(key)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request OTP first"));

        if (user.getOtpExpiresAt() == null || user.getOtpExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired — please request a new OTP");
        }
        if (!otp.trim().equals(user.getPendingOtp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
        }

        user.setPendingOtp(null);
        user.setOtpExpiresAt(null);
        user.setVerified(true);
        user.setSessionToken("sg_" + UUID.randomUUID().toString().replace("-", ""));
        user.setUpdatedAt(Instant.now());
        repo.save(user);

        return new AuthSessionResult(
                user.getAccountKey(),
                user.getDisplayName() != null ? user.getDisplayName() : user.getAccountKey(),
                user.getSessionToken(),
                true
        );
    }

    public AuthSessionResult me(String token) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing session token");
        }
        UserAccount user = repo.findBySessionToken(token.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session token"));
        return new AuthSessionResult(
                user.getAccountKey(),
                user.getDisplayName() != null ? user.getDisplayName() : user.getAccountKey(),
                user.getSessionToken(),
                user.isVerified()
        );
    }

    private static String normalizeKey(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email or phone is required");
        }
        return raw.trim().toLowerCase(Locale.ROOT);
    }
}
