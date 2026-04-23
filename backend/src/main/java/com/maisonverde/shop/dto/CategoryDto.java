package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.Category;

public record CategoryDto(Long id, String slug, String name, String description) {

    public static CategoryDto from(Category c) {
        return new CategoryDto(c.getId(), c.getSlug(), c.getName(), c.getDescription());
    }
}
