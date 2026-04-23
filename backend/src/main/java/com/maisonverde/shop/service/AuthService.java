package com.maisonverde.shop.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.maisonverde.shop.dto.AuthResponse;
import com.maisonverde.shop.dto.GoogleLoginRequest;
import com.maisonverde.shop.dto.LoginRequest;
import com.maisonverde.shop.dto.RegisterRequest;
import com.maisonverde.shop.dto.UserDto;
import com.maisonverde.shop.entity.AuthProvider;
import com.maisonverde.shop.entity.User;
import com.maisonverde.shop.repository.UserRepository;
import com.maisonverde.shop.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String googleClientId;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.auth.google-client-id:}") String googleClientId
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleClientId = googleClientId;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setName(req.name().trim());
        u.setProvider(AuthProvider.LOCAL);
        userRepository.save(u);
        return issueToken(u);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không đúng"));
        if (u.getPasswordHash() == null || !passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không đúng");
        }
        return issueToken(u);
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest req) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new IllegalStateException("Google Client ID chưa được cấu hình");
        }
        GoogleIdToken.Payload payload;
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            GoogleIdToken idToken = verifier.verify(req.idToken());
            if (idToken == null) {
                throw new IllegalArgumentException("Google ID token không hợp lệ");
            }
            payload = idToken.getPayload();
        } catch (GeneralSecurityException | java.io.IOException e) {
            throw new IllegalArgumentException("Không thể xác thực Google token: " + e.getMessage());
        }

        String sub = payload.getSubject();
        String email = payload.getEmail() == null ? null : payload.getEmail().toLowerCase();
        String name = (String) payload.get("name");

        // Ưu tiên match theo googleSub; nếu không thì match theo email (link account LOCAL → GOOGLE)
        Optional<User> existing = userRepository.findByGoogleSub(sub);
        if (existing.isEmpty() && email != null) {
            existing = userRepository.findByEmail(email);
        }

        User u = existing.orElseGet(User::new);
        if (u.getId() == null) {
            u.setEmail(email);
            u.setProvider(AuthProvider.GOOGLE);
        }
        if (u.getGoogleSub() == null) u.setGoogleSub(sub);
        if (u.getName() == null && name != null) u.setName(name);
        userRepository.save(u);
        return issueToken(u);
    }

    private AuthResponse issueToken(User u) {
        String token = jwtService.issue(u.getId(), u.getEmail());
        return new AuthResponse(token, UserDto.from(u));
    }
}
