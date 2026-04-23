package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.OrderItem;

public record OrderItemDto(
        Long id,
        Long productId,
        String productSlug,
        String productName,
        String colorName,
        Integer quantity,
        Integer unitPrice,
        Integer lineTotal,
        String imageUrl
) {
    public static OrderItemDto from(OrderItem i) {
        return new OrderItemDto(
                i.getId(),
                i.getProduct().getId(),
                i.getProduct().getSlug(),
                i.getProductName(),
                i.getColorName(),
                i.getQuantity(),
                i.getUnitPrice(),
                i.getUnitPrice() * i.getQuantity(),
                i.getProduct().getImageUrl()
        );
    }
}
