package com.maisonverde.shop.repository;

import com.maisonverde.shop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = {"category", "colors"})
    Page<Product> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "colors"})
    Page<Product> findByCategory_Slug(String slug, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "colors"})
    Optional<Product> findBySlug(String slug);

    @EntityGraph(attributePaths = {"category", "colors"})
    Optional<Product> findById(Long id);

    /** Tìm kiếm theo name / description / material, case-insensitive. */
    @EntityGraph(attributePaths = {"category", "colors"})
    @Query("""
            select p from Product p
            where lower(p.name) like lower(concat('%', :q, '%'))
               or lower(p.description) like lower(concat('%', :q, '%'))
               or lower(p.material) like lower(concat('%', :q, '%'))
            """)
    Page<Product> search(@Param("q") String q, Pageable pageable);
}
