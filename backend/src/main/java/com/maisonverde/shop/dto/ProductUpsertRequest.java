package com.maisonverde.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ProductUpsertRequest(
        @NotBlank @Size(max = 64) String slug,
        @NotBlank @Size(max = 128) String name,
        @Size(max = 1024) String description,
        @Size(max = 64) String material,
        @NotNull @Positive Integer price,
        @PositiveOrZero Integer salePrice,
        @Size(max = 16) String badge,
        @NotBlank @Size(max = 16) String silhouette,
        @Size(max = 512) String imageUrl,
        @NotNull Long categoryId
) {}
