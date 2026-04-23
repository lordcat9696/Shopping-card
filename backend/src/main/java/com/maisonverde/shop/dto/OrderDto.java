package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.Order;
import com.maisonverde.shop.entity.OrderStatus;
import com.maisonverde.shop.entity.PaymentMethod;

import java.time.Instant;
import java.util.List;

public record OrderDto(
        Long id,
        String code,
        OrderStatus status,
        PaymentMethod paymentMethod,
        ShippingAddressDto shippingAddress,
        Integer subtotal,
        Integer shippingFee,
        Integer total,
        List<OrderItemDto> items,
        Instant createdAt
) {
    public static OrderDto from(Order o) {
        return new OrderDto(
                o.getId(),
                o.getCode(),
                o.getStatus(),
                o.getPaymentMethod(),
                ShippingAddressDto.from(o.getShippingAddress()),
                o.getSubtotal(),
                o.getShippingFee(),
                o.getTotal(),
                o.getItems().stream().map(OrderItemDto::from).toList(),
                o.getCreatedAt()
        );
    }
}
