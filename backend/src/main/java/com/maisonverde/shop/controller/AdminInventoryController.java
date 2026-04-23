package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.InventoryItemDto;
import com.maisonverde.shop.dto.UpdateStockRequest;
import com.maisonverde.shop.service.AdminInventoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin — Inventory")
@RestController
@RequestMapping("/api/v1/admin/inventory")
public class AdminInventoryController {

    private final AdminInventoryService service;

    public AdminInventoryController(AdminInventoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<InventoryItemDto> list() {
        return service.list();
    }

    @PatchMapping("/{colorId}")
    public InventoryItemDto updateStock(
            @PathVariable Long colorId,
            @Valid @RequestBody UpdateStockRequest req) {
        return service.updateStock(colorId, req.stock());
    }
}
