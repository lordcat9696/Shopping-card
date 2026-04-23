package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
        @NotBlank String cartId,
        @NotNull PaymentMethod paymentMethod,
        @NotNull @Valid ShippingAddressDto shippingAddress
) {}
