package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.AddItemRequest;
import com.maisonverde.shop.dto.CartDto;
import com.maisonverde.shop.entity.Cart;
import com.maisonverde.shop.entity.CartItem;
import com.maisonverde.shop.entity.Product;
import com.maisonverde.shop.entity.User;
import com.maisonverde.shop.repository.CartRepository;
import com.maisonverde.shop.repository.ProductRepository;
import com.maisonverde.shop.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository carts;
    private final ProductRepository products;
    private final UserRepository users;

    public CartService(CartRepository carts, ProductRepository products, UserRepository users) {
        this.carts = carts;
        this.products = products;
        this.users = users;
    }

    /** Lấy cart hiện tại của user; tạo mới nếu chưa có. */
    @Transactional
    public CartDto getOrCreateForUser(Long userId) {
        Cart cart = carts.findFirstByUser_IdOrderByUpdatedAtDesc(userId).orElseGet(() -> {
            User u = users.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found: " + userId));
            Cart c = new Cart();
            c.setUser(u);
            return carts.save(c);
        });
        return CartDto.from(cart);
    }

    @Transactional
    public CartDto addItem(String cartId, Long userId, AddItemRequest req) {
        Cart cart = loadOwnedCart(cartId, userId);
        Product product = products.findById(req.productId())
                .orElseThrow(() -> new NotFoundException("Product not found: " + req.productId()));

        // Check stock của variant màu user đang chọn.
        var color = product.getColors().stream()
                .filter(c -> c.getName().equalsIgnoreCase(req.colorName()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Màu không tồn tại: " + req.colorName()));

        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId())
                        && i.getColorName().equalsIgnoreCase(req.colorName()))
                .findFirst().orElse(null);

        int desiredQuantity = (existing == null ? 0 : existing.getQuantity()) + req.quantity();
        int stock = color.getStock() == null ? 0 : color.getStock();
        if (desiredQuantity > stock) {
            throw new IllegalArgumentException(
                    "Không đủ hàng cho \"" + product.getName() + " / " + color.getName()
                            + "\". Còn lại: " + stock);
        }

        int effectivePrice = product.getSalePrice() != null ? product.getSalePrice() : product.getPrice();

        if (existing != null) {
            existing.setQuantity(desiredQuantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setColorName(req.colorName());
            item.setQuantity(req.quantity());
            item.setPriceSnapshot(effectivePrice);
            cart.getItems().add(item);
        }
        return CartDto.from(carts.save(cart));
    }

    @Transactional
    public CartDto updateItem(String cartId, Long userId, Long itemId, int quantity) {
        Cart cart = loadOwnedCart(cartId, userId);
        CartItem ci = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Cart item not found: " + itemId));
        if (quantity <= 0) {
            cart.getItems().remove(ci);
        } else {
            // Check stock khi tăng qty
            var color = ci.getProduct().getColors().stream()
                    .filter(c -> c.getName().equalsIgnoreCase(ci.getColorName()))
                    .findFirst().orElse(null);
            int stock = color == null || color.getStock() == null ? 0 : color.getStock();
            if (quantity > stock) {
                throw new IllegalArgumentException(
                        "Không đủ hàng cho \"" + ci.getProduct().getName() + " / " + ci.getColorName()
                                + "\". Còn lại: " + stock);
            }
            ci.setQuantity(quantity);
        }
        return CartDto.from(carts.save(cart));
    }

    @Transactional
    public CartDto removeItem(String cartId, Long userId, Long itemId) {
        Cart cart = loadOwnedCart(cartId, userId);
        boolean removed = cart.getItems().removeIf(i -> i.getId().equals(itemId));
        if (!removed) throw new NotFoundException("Cart item not found: " + itemId);
        return CartDto.from(carts.save(cart));
    }

    /** Tìm cart theo id + check ownership — chặn việc đoán UUID của user khác. */
    private Cart loadOwnedCart(String cartId, Long userId) {
        Cart cart = carts.findById(cartId)
                .orElseThrow(() -> new NotFoundException("Cart not found: " + cartId));
        if (cart.getUser() == null || !cart.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Cart không thuộc user này");
        }
        return cart;
    }
}
