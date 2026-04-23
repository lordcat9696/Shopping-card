package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.AuthProvider;
import com.maisonverde.shop.entity.Role;
import com.maisonverde.shop.entity.User;

public record UserDto(
        Long id,
        String email,
        String name,
        String phone,
        AuthProvider provider,
        Role role
) {
    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getEmail(), u.getName(), u.getPhone(), u.getProvider(), u.getRole());
    }
}
