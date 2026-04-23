package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.CreateOrderRequest;
import com.maisonverde.shop.dto.OrderDto;
import com.maisonverde.shop.security.AppUserPrincipal;
import com.maisonverde.shop.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Orders")
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<OrderDto> create(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @Valid @RequestBody CreateOrderRequest req) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.create(principal.getId(), req));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> list(@AuthenticationPrincipal AppUserPrincipal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.listForUser(principal.getId()));
    }

    @GetMapping("/{code}")
    public ResponseEntity<OrderDto> get(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @PathVariable String code) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.getByCodeForUser(code, principal.getId()));
    }

    @PostMapping("/{code}/cancel")
    public ResponseEntity<OrderDto> cancel(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @PathVariable String code) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(service.cancelByUser(code, principal.getId()));
    }
}
