package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.CreateOrderRequest;
import com.maisonverde.shop.dto.OrderDto;
import com.maisonverde.shop.entity.Cart;
import com.maisonverde.shop.entity.CartItem;
import com.maisonverde.shop.entity.Order;
import com.maisonverde.shop.entity.OrderItem;
import com.maisonverde.shop.entity.OrderStatus;
import com.maisonverde.shop.entity.Product;
import com.maisonverde.shop.entity.ProductColor;
import com.maisonverde.shop.entity.User;
import com.maisonverde.shop.repository.CartRepository;
import com.maisonverde.shop.repository.OrderRepository;
import com.maisonverde.shop.repository.ProductRepository;
import com.maisonverde.shop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
public class OrderService {

    private static final int DEFAULT_SHIPPING_FEE = 30_000; // 30k VND flat-rate MVP
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // loại 0/O, 1/I

    private final OrderRepository orders;
    private final CartRepository carts;
    private final UserRepository users;
    private final ProductRepository products;
    private final EmailService emailService;

    public OrderService(OrderRepository orders, CartRepository carts, UserRepository users,
                        ProductRepository products, EmailService emailService) {
        this.orders = orders;
        this.carts = carts;
        this.users = users;
        this.products = products;
        this.emailService = emailService;
    }

    @Transactional
    public OrderDto create(Long userId, CreateOrderRequest req) {
        User user = users.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
        Cart cart = carts.findById(req.cartId())
                .orElseThrow(() -> new NotFoundException("Cart not found: " + req.cartId()));
        if (cart.getUser() == null || !cart.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cart không thuộc user này");
        }
        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng đang trống");
        }

        // BƯỚC 1: verify stock cho toàn bộ items trước khi tạo order.
        for (CartItem ci : cart.getItems()) {
            ProductColor color = findColor(ci.getProduct(), ci.getColorName());
            int stock = color.getStock() == null ? 0 : color.getStock();
            if (ci.getQuantity() > stock) {
                throw new IllegalArgumentException(
                        "Không đủ hàng cho \"" + ci.getProduct().getName() + " / " + ci.getColorName()
                                + "\". Còn lại: " + stock + ", cần: " + ci.getQuantity());
            }
        }

        // BƯỚC 2: tạo order + decrement stock.
        Order order = new Order();
        order.setCode(generateUniqueCode());
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(req.paymentMethod());
        order.setShippingAddress(req.shippingAddress().toEntity());
        order.setShippingFee(DEFAULT_SHIPPING_FEE);

        int subtotal = 0;
        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(ci.getProduct());
            oi.setProductName(ci.getProduct().getName());
            oi.setColorName(ci.getColorName());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(ci.getPriceSnapshot());
            order.getItems().add(oi);
            subtotal += ci.getPriceSnapshot() * ci.getQuantity();

            ProductColor color = findColor(ci.getProduct(), ci.getColorName());
            color.setStock(color.getStock() - ci.getQuantity());
        }
        order.setSubtotal(subtotal);
        order.setTotal(subtotal + DEFAULT_SHIPPING_FEE);

        Order saved = orders.save(order);
        carts.delete(cart);

        // Gửi email xác nhận (async, non-blocking).
        emailService.sendOrderConfirmation(saved);
        return OrderDto.from(saved);
    }

    /**
     * User tự huỷ đơn của mình. Chỉ cho huỷ khi order còn ở PENDING hoặc CONFIRMED
     * (đã SHIPPING hoặc DELIVERED thì không huỷ được). Hoàn stock + gửi email.
     */
    @Transactional
    public OrderDto cancelByUser(String code, Long userId) {
        Order order = orders.findByCodeAndUser_Id(code, userId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + code));
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Không thể huỷ đơn ở trạng thái hiện tại (" + order.getStatus() + ")");
        }
        cancelAndRefund(order);
        return OrderDto.from(orders.save(order));
    }

    /** Chuyển status → CANCELLED và hoàn stock. Không check status trước (caller lo). */
    public void cancelAndRefund(Order order) {
        if (order.getStatus() == OrderStatus.CANCELLED) return;  // idempotent
        order.setStatus(OrderStatus.CANCELLED);
        for (OrderItem oi : order.getItems()) {
            Product p = products.findById(oi.getProduct().getId()).orElse(null);
            if (p == null) continue;
            p.getColors().stream()
                    .filter(c -> c.getName().equalsIgnoreCase(oi.getColorName()))
                    .findFirst()
                    .ifPresent(c -> c.setStock((c.getStock() == null ? 0 : c.getStock()) + oi.getQuantity()));
        }
        emailService.sendOrderStatusUpdate(order);
    }

    @Transactional(readOnly = true)
    public OrderDto getByCodeForUser(String code, Long userId) {
        Order o = orders.findByCodeAndUser_Id(code, userId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + code));
        return OrderDto.from(o);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> listForUser(Long userId) {
        return orders.findByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(OrderDto::from).toList();
    }

    private ProductColor findColor(Product p, String colorName) {
        return p.getColors().stream()
                .filter(c -> c.getName().equalsIgnoreCase(colorName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Màu \"" + colorName + "\" không tồn tại cho sản phẩm \"" + p.getName() + "\""));
    }

    private String generateUniqueCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            StringBuilder sb = new StringBuilder("MV");
            for (int i = 0; i < 6; i++) {
                sb.append(CODE_ALPHABET.charAt(RANDOM.nextInt(CODE_ALPHABET.length())));
            }
            String code = sb.toString();
            if (!orders.existsByCode(code)) return code;
        }
        throw new IllegalStateException("Không tạo được mã đơn sau 10 lần thử");
    }
}
