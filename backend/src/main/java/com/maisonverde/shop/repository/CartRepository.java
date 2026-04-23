package com.maisonverde.shop.repository;

import com.maisonverde.shop.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Cart> findById(String id);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Cart> findFirstByUser_IdOrderByUpdatedAtDesc(Long userId);
}
