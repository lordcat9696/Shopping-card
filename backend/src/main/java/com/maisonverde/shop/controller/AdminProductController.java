package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.ProductDto;
import com.maisonverde.shop.dto.ProductUpsertRequest;
import com.maisonverde.shop.service.AdminProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Admin — Products")
@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {

    private final AdminProductService service;

    public AdminProductController(AdminProductService service) {
        this.service = service;
    }

    @PostMapping
    public ProductDto create(@Valid @RequestBody ProductUpsertRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @Valid @RequestBody ProductUpsertRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
