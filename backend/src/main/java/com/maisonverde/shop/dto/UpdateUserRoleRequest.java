package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(@NotNull Role role) {}
