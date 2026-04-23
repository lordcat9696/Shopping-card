package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.ProductDto;
import com.maisonverde.shop.dto.ProductUpsertRequest;
import com.maisonverde.shop.entity.Category;
import com.maisonverde.shop.entity.Product;
import com.maisonverde.shop.repository.CategoryRepository;
import com.maisonverde.shop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProductService {

    private final ProductRepository products;
    private final CategoryRepository categories;

    public AdminProductService(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    @Transactional
    public ProductDto create(ProductUpsertRequest req) {
        if (products.findBySlug(req.slug()).isPresent()) {
            throw new IllegalArgumentException("Slug đã tồn tại: " + req.slug());
        }
        Category cat = categories.findById(req.categoryId())
                .orElseThrow(() -> new NotFoundException("Category not found: " + req.categoryId()));

        Product p = new Product();
        apply(req, p, cat);
        return ProductDto.from(products.save(p));
    }

    @Transactional
    public ProductDto update(Long id, ProductUpsertRequest req) {
        Product p = products.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
        if (!p.getSlug().equals(req.slug()) && products.findBySlug(req.slug()).isPresent()) {
            throw new IllegalArgumentException("Slug đã tồn tại: " + req.slug());
        }
        Category cat = categories.findById(req.categoryId())
                .orElseThrow(() -> new NotFoundException("Category not found: " + req.categoryId()));

        apply(req, p, cat);
        return ProductDto.from(products.save(p));
    }

    @Transactional
    public void delete(Long id) {
        Product p = products.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
        products.delete(p);
    }

    private void apply(ProductUpsertRequest req, Product p, Category cat) {
        p.setSlug(req.slug().trim());
        p.setName(req.name().trim());
        p.setDescription(req.description());
        p.setMaterial(req.material());
        p.setPrice(req.price());
        p.setSalePrice(req.salePrice());
        p.setBadge(req.badge());
        p.setSilhouette(req.silhouette().trim());
        p.setImageUrl(req.imageUrl());
        p.setCategory(cat);
    }
}
