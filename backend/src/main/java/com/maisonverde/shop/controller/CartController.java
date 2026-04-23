package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.AddItemRequest;
import com.maisonverde.shop.dto.CartDto;
import com.maisonverde.shop.dto.UpdateItemRequest;
import com.maisonverde.shop.security.AppUserPrincipal;
import com.maisonverde.shop.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Cart")
@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @GetMapping("/my")
    public ResponseEntity<CartDto> getMy(@AuthenticationPrincipal AppUserPrincipal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.getOrCreateForUser(principal.getId()));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<CartDto> addItem(
            @PathVariable String id,
            @AuthenticationPrincipal AppUserPrincipal principal,
            @Valid @RequestBody AddItemRequest req) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.addItem(id, principal.getId(), req));
    }

    @PatchMapping("/{id}/items/{itemId}")
    public ResponseEntity<CartDto> updateItem(
            @PathVariable String id,
            @PathVariable Long itemId,
            @AuthenticationPrincipal AppUserPrincipal principal,
            @Valid @RequestBody UpdateItemRequest req) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.updateItem(id, principal.getId(), itemId, req.quantity()));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<CartDto> removeItem(
            @PathVariable String id,
            @PathVariable Long itemId,
            @AuthenticationPrincipal AppUserPrincipal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.removeItem(id, principal.getId(), itemId));
    }
}
