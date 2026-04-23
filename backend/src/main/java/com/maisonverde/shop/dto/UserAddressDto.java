package com.maisonverde.shop.dto;

import com.maisonverde.shop.entity.UserAddress;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserAddressDto(
        Long id,
        @NotBlank @Size(max = 128) String fullName,
        @NotBlank
        @Pattern(regexp = "^(0|\\+84)\\d{9,10}$", message = "SĐT phải là 10 chữ số bắt đầu bằng 0 (hoặc +84 rồi 9–10 chữ số)")
        String phone,
        @NotBlank @Size(max = 256) String line1,
        @Size(max = 128) String ward,
        @Size(max = 128) String district,
        @NotBlank @Size(max = 128) String city,
        @Size(max = 512) String note,
        boolean isDefault
) {
    public static UserAddressDto from(UserAddress a) {
        return new UserAddressDto(
                a.getId(),
                a.getFullName(),
                a.getPhone(),
                a.getLine1(),
                a.getWard(),
                a.getDistrict(),
                a.getCity(),
                a.getNote(),
                a.isDefaultAddress()
        );
    }
}
