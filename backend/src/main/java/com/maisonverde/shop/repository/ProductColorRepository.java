package com.maisonverde.shop.repository;

import com.maisonverde.shop.entity.ProductColor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductColorRepository extends JpaRepository<ProductColor, Long> {

    @EntityGraph(attributePaths = {"product"})
    List<ProductColor> findAllByOrderByProduct_NameAscNameAsc();

    @EntityGraph(attributePaths = {"product"})
    Optional<ProductColor> findById(Long id);
}
