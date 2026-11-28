package com.vedas.controller;

import com.vedas.service.AuthService;
import com.vedas.service.AuthService.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record OtpReq(@NotBlank String accountKey, String displayName) {}
    public record VerifyOtpReq(@NotBlank String accountKey, @NotBlank String otp) {}

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/request-otp")
    public OtpRequestResult requestOtp(@RequestBody OtpReq req) {
        return authService.requestOtp(req.accountKey(), req.displayName());
    }

    @PostMapping("/verify-otp")
    public AuthSessionResult verifyOtp(@RequestBody VerifyOtpReq req) {
        return authService.verifyOtp(req.accountKey(), req.otp());
    }

    @GetMapping("/me")
    public AuthSessionResult me(@RequestHeader(value = "X-Session-Token", required = false) String token) {
        return authService.me(token);
    }
}
