package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.UserAddressDto;
import com.maisonverde.shop.security.AppUserPrincipal;
import com.maisonverde.shop.service.UserAddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "User Addresses")
@RestController
@RequestMapping("/api/v1/addresses")
public class UserAddressController {

    private final UserAddressService service;

    public UserAddressController(UserAddressService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<UserAddressDto>> list(@AuthenticationPrincipal AppUserPrincipal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(
                service.list(principal.getId()).stream().map(UserAddressDto::from).toList()
        );
    }

    @PostMapping
    public ResponseEntity<UserAddressDto> create(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @Valid @RequestBody UserAddressDto req) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(UserAddressDto.from(service.create(principal.getId(), req)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserAddressDto> update(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UserAddressDto req) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(UserAddressDto.from(service.update(principal.getId(), id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @PathVariable Long id) {
        if (principal == null) return ResponseEntity.status(401).build();
        service.delete(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/default")
    public ResponseEntity<UserAddressDto> setDefault(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @PathVariable Long id) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(UserAddressDto.from(service.setDefault(principal.getId(), id)));
    }
}
