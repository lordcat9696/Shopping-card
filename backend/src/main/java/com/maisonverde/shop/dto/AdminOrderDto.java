package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.Order;
import com.maisonverde.shop.entity.OrderStatus;
import com.maisonverde.shop.entity.PaymentMethod;

import java.time.Instant;
import java.util.List;

/** Variant của OrderDto cho admin — include thông tin user để tra cứu. */
public record AdminOrderDto(
        Long id,
        String code,
        OrderStatus status,
        PaymentMethod paymentMethod,
        ShippingAddressDto shippingAddress,
        Integer subtotal,
        Integer shippingFee,
        Integer total,
        List<OrderItemDto> items,
        Instant createdAt,
        Long userId,
        String userEmail,
        String userName
) {
    public static AdminOrderDto from(Order o) {
        return new AdminOrderDto(
                o.getId(),
                o.getCode(),
                o.getStatus(),
                o.getPaymentMethod(),
                ShippingAddressDto.from(o.getShippingAddress()),
                o.getSubtotal(),
                o.getShippingFee(),
                o.getTotal(),
                o.getItems().stream().map(OrderItemDto::from).toList(),
                o.getCreatedAt(),
                o.getUser() == null ? null : o.getUser().getId(),
                o.getUser() == null ? null : o.getUser().getEmail(),
                o.getUser() == null ? null : o.getUser().getName()
        );
    }
}
