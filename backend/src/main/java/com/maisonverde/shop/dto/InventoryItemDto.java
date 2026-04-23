package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.ProductColor;

public record InventoryItemDto(
        Long colorId,
        Long productId,
        String productSlug,
        String productName,
        String productImageUrl,
        String colorName,
        String colorHex,
        int stock
) {
    public static InventoryItemDto from(ProductColor c) {
        return new InventoryItemDto(
                c.getId(),
                c.getProduct().getId(),
                c.getProduct().getSlug(),
                c.getProduct().getName(),
                c.getProduct().getImageUrl(),
                c.getName(),
                c.getHexCode(),
                c.getStock() == null ? 0 : c.getStock()
        );
    }
}
