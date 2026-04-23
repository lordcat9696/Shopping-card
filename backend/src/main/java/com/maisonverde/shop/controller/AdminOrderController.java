package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.AdminOrderDto;
import com.maisonverde.shop.dto.OrderStatsResponse;
import com.maisonverde.shop.dto.UpdateOrderStatusRequest;
import com.maisonverde.shop.entity.OrderStatus;
import com.maisonverde.shop.service.AdminOrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Tag(name = "Admin — Orders")
@RestController
@RequestMapping("/api/v1/admin/orders")
public class AdminOrderController {

    private final AdminOrderService service;

    public AdminOrderController(AdminOrderService service) {
        this.service = service;
    }

    @GetMapping
    public Page<AdminOrderDto> list(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return service.search(status, q, pageable);
    }

    @GetMapping("/{id}")
    public AdminOrderDto getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PatchMapping("/{id}/status")
    public AdminOrderDto updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest req) {
        return service.updateStatus(id, req.status());
    }

    @GetMapping("/stats")
    public OrderStatsResponse stats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) OrderStatus status) {
        return service.stats(from, to, status);
    }
}
