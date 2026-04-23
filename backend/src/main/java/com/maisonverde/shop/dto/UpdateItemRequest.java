package com.maisonverde.shop.dto;

import jakarta.validation.constraints.Min;

public record UpdateItemRequest(@Min(1) int quantity) {}
