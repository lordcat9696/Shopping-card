package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.AuthResponse;
import com.maisonverde.shop.dto.GoogleLoginRequest;
import com.maisonverde.shop.dto.LoginRequest;
import com.maisonverde.shop.dto.RegisterRequest;
import com.maisonverde.shop.dto.UserDto;
import com.maisonverde.shop.security.AppUserPrincipal;
import com.maisonverde.shop.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/google")
    public AuthResponse google(@Valid @RequestBody GoogleLoginRequest req) {
        return authService.loginWithGoogle(req);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal AppUserPrincipal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(UserDto.from(principal.getUser()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Stateless — client discards token. Endpoint is 204 for symmetry.
        return ResponseEntity.noContent().build();
    }
}
