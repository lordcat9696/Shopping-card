package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.ProductImage;

public record ProductImageDto(String url, String alt, int sortOrder) {

    public static ProductImageDto from(ProductImage img) {
        return new ProductImageDto(img.getUrl(), img.getAlt(), img.getSortOrder());
    }
}
