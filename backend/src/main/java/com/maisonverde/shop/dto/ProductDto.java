package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.Product;

import java.util.List;

public record ProductDto(
        Long id,
        String slug,
        String name,
        String description,
        String material,
        Integer price,
        Integer salePrice,
        String badge,
        String silhouette,
        String imageUrl,
        CategoryDto category,
        List<ProductColorDto> colors,
        List<ProductImageDto> images
) {
    public static ProductDto from(Product p) {
        return new ProductDto(
                p.getId(),
                p.getSlug(),
                p.getName(),
                p.getDescription(),
                p.getMaterial(),
                p.getPrice(),
                p.getSalePrice(),
                p.getBadge(),
                p.getSilhouette(),
                p.getImageUrl(),
                p.getCategory() == null ? null : CategoryDto.from(p.getCategory()),
                p.getColors().stream().map(ProductColorDto::from).toList(),
                p.getImages().stream().map(ProductImageDto::from).toList()
        );
    }
}
