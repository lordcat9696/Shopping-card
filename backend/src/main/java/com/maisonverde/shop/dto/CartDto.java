package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.Cart;
import com.maisonverde.shop.entity.CartItem;

import java.util.List;

public record CartDto(String id, List<CartItemDto> items, int subtotal, int itemCount) {

    public static CartDto from(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream().map(CartItemDto::from).toList();
        int subtotal = items.stream().mapToInt(CartItemDto::lineTotal).sum();
        int itemCount = items.stream().mapToInt(CartItemDto::quantity).sum();
        return new CartDto(cart.getId(), items, subtotal, itemCount);
    }

    public record CartItemDto(
            Long id,
            Long productId,
            String productSlug,
            String productName,
            String imageUrl,
            String colorName,
            String colorHex,
            int quantity,
            int unitPrice,
            int lineTotal
    ) {
        public static CartItemDto from(CartItem ci) {
            int line = ci.getPriceSnapshot() * ci.getQuantity();
            String colorHex = ci.getProduct().getColors().stream()
                    .filter(c -> c.getName().equalsIgnoreCase(ci.getColorName()))
                    .map(c -> c.getHexCode())
                    .findFirst().orElse(null);
            return new CartItemDto(
                    ci.getId(),
                    ci.getProduct().getId(),
                    ci.getProduct().getSlug(),
                    ci.getProduct().getName(),
                    ci.getProduct().getImageUrl(),
                    ci.getColorName(),
                    colorHex,
                    ci.getQuantity(),
                    ci.getPriceSnapshot(),
                    line
            );
        }
    }
}
