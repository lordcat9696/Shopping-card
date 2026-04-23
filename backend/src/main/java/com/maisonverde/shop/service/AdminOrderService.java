package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.AdminOrderDto;
import com.maisonverde.shop.dto.OrderStatsResponse;
import com.maisonverde.shop.entity.Order;
import com.maisonverde.shop.entity.OrderStatus;
import com.maisonverde.shop.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class AdminOrderService {

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final OrderRepository orders;
    private final OrderService orderService;
    private final EmailService emailService;

    public AdminOrderService(OrderRepository orders, OrderService orderService, EmailService emailService) {
        this.orders = orders;
        this.orderService = orderService;
        this.emailService = emailService;
    }

    @Transactional(readOnly = true)
    public Page<AdminOrderDto> search(OrderStatus status, String q, Pageable pageable) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        return orders.adminSearch(status, query, pageable).map(AdminOrderDto::from);
    }

    @Transactional(readOnly = true)
    public AdminOrderDto getById(Long id) {
        Order o = orders.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        return AdminOrderDto.from(o);
    }

    @Transactional
    public AdminOrderDto updateStatus(Long orderId, OrderStatus newStatus) {
        Order o = orders.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
        if (o.getStatus() == newStatus) {
            return AdminOrderDto.from(o);
        }
        if (newStatus == OrderStatus.CANCELLED) {
            // Huỷ đơn → hoàn stock + gửi mail
            orderService.cancelAndRefund(o);
        } else {
            o.setStatus(newStatus);
            emailService.sendOrderStatusUpdate(o);
        }
        return AdminOrderDto.from(orders.save(o));
    }

    private static final long MAX_RANGE_DAYS = 366;  // 1 năm + buffer cho năm nhuận

    /**
     * Thống kê trong khoảng ngày (inclusive).
     * Bucket theo ngày (VN timezone). Nếu status null → tính tất cả.
     * Giới hạn range tối đa 1 năm để tránh query quá nặng.
     */
    @Transactional(readOnly = true)
    public OrderStatsResponse stats(LocalDate from, LocalDate to, OrderStatus status) {
        if (from.isAfter(to)) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc");
        }
        long days = java.time.temporal.ChronoUnit.DAYS.between(from, to) + 1;
        if (days > MAX_RANGE_DAYS) {
            throw new IllegalArgumentException("Khoảng thời gian tối đa 1 năm");
        }
        Instant fromInstant = from.atStartOfDay(VN_ZONE).toInstant();
        Instant toInstant = to.plusDays(1).atStartOfDay(VN_ZONE).toInstant();  // exclusive upper

        List<Order> ordersInRange = orders.findByCreatedAtBetween(fromInstant, toInstant);

        // Filter theo status nếu có
        List<Order> filtered = status == null
                ? ordersInRange
                : ordersInRange.stream().filter(o -> o.getStatus() == status).toList();

        int totalOrders = filtered.size();
        long totalRevenue = filtered.stream().mapToLong(Order::getTotal).sum();

        // Status breakdown (dùng all-range để FE thấy tổng kể cả khi filter)
        Map<OrderStatus, OrderStatsResponse.StatusBucket> statusMap = new HashMap<>();
        for (Order o : ordersInRange) {
            statusMap.compute(o.getStatus(), (k, v) ->
                    v == null
                            ? new OrderStatsResponse.StatusBucket(k, 1, o.getTotal())
                            : new OrderStatsResponse.StatusBucket(k, v.count() + 1, v.revenue() + o.getTotal())
            );
        }

        // Daily buckets — dùng TreeMap để sort theo ngày
        TreeMap<LocalDate, OrderStatsResponse.DailyBucket> dailyMap = new TreeMap<>();
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            dailyMap.put(d, new OrderStatsResponse.DailyBucket(d, 0, 0L));
        }
        for (Order o : filtered) {
            LocalDate d = o.getCreatedAt().atZone(VN_ZONE).toLocalDate();
            dailyMap.compute(d, (k, v) ->
                    v == null
                            ? new OrderStatsResponse.DailyBucket(k, 1, (long) o.getTotal())
                            : new OrderStatsResponse.DailyBucket(k, v.count() + 1, v.revenue() + o.getTotal())
            );
        }

        return new OrderStatsResponse(
                from, to, totalOrders, totalRevenue,
                statusMap.values().stream().toList(),
                dailyMap.values().stream().toList()
        );
    }
}
