package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.OrderStatus;

import java.time.LocalDate;
import java.util.List;

public record OrderStatsResponse(
        LocalDate from,
        LocalDate to,
        int totalOrders,
        long totalRevenue,
        List<StatusBucket> statusBreakdown,
        List<DailyBucket> daily
) {
    public record StatusBucket(OrderStatus status, int count, long revenue) {}
    public record DailyBucket(LocalDate date, int count, long revenue) {}
}
