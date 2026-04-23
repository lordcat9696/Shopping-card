package com.maisonverde.shop.repository;

import com.maisonverde.shop.entity.Order;
import com.maisonverde.shop.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByCode(String code);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByIdAndUser_Id(Long id, Long userId);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByCodeAndUser_Id(String code, Long userId);

    List<Order> findByUser_IdOrderByCreatedAtDesc(Long userId);

    boolean existsByCode(String code);

    /** Admin search: filter optional status + optional q (match code / user name / user email). */
    @EntityGraph(attributePaths = {"items", "items.product", "user"})
    @Query("""
            select o from Order o
            where (:status is null or o.status = :status)
              and (:q is null or :q = ''
                    or lower(o.code) like lower(concat('%', :q, '%'))
                    or lower(o.user.name) like lower(concat('%', :q, '%'))
                    or lower(o.user.email) like lower(concat('%', :q, '%')))
            """)
    Page<Order> adminSearch(@Param("status") OrderStatus status, @Param("q") String q, Pageable pageable);

    List<Order> findByCreatedAtBetween(Instant from, Instant to);
}
