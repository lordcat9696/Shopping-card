package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.ProductColor;

public record ProductColorDto(
        Long id,
        String name,
        String hexCode,
        boolean isDefault,
        int stock
) {
    public static ProductColorDto from(ProductColor c) {
        return new ProductColorDto(
                c.getId(),
                c.getName(),
                c.getHexCode(),
                c.isDefaultColor(),
                c.getStock() == null ? 0 : c.getStock()
        );
    }
}
