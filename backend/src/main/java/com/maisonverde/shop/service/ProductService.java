package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.ProductDto;
import com.maisonverde.shop.entity.Product;
import com.maisonverde.shop.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> list(String category, String q, Pageable pageable) {
        Page<Product> page;
        if (q != null && !q.isBlank()) {
            page = repository.search(q.trim(), pageable);
        } else if (category != null && !category.isBlank()) {
            page = repository.findByCategory_Slug(category, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return page.map(ProductDto::from);
    }

    @Transactional(readOnly = true)
    public ProductDto getByIdOrSlug(String idOrSlug) {
        Product p = idOrSlug.matches("\\d+")
                ? repository.findById(Long.valueOf(idOrSlug))
                    .orElseThrow(() -> new NotFoundException("Product not found: " + idOrSlug))
                : repository.findBySlug(idOrSlug)
                    .orElseThrow(() -> new NotFoundException("Product not found: " + idOrSlug));
        return ProductDto.from(p);
    }
}
