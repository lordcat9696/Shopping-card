package com.maisonverde.shop.entity;

public enum OrderStatus {
    PENDING,      // đã đặt, chờ xử lý
    CONFIRMED,    // shop đã xác nhận
    SHIPPING,     // đang giao
    DELIVERED,    // đã giao
    CANCELLED
}
