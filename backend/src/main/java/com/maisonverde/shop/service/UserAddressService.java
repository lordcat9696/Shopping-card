package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.UserAddressDto;
import com.maisonverde.shop.entity.User;
import com.maisonverde.shop.entity.UserAddress;
import com.maisonverde.shop.repository.UserAddressRepository;
import com.maisonverde.shop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserAddressService {

    private final UserAddressRepository addresses;
    private final UserRepository users;

    public UserAddressService(UserAddressRepository addresses, UserRepository users) {
        this.addresses = addresses;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<UserAddress> list(Long userId) {
        return addresses.findByUser_IdOrderByDefaultAddressDescCreatedAtDesc(userId);
    }

    @Transactional
    public UserAddress create(Long userId, UserAddressDto req) {
        User user = users.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
        UserAddress a = new UserAddress();
        a.setUser(user);
        copy(req, a);

        // Nếu đây là địa chỉ đầu tiên, set mặc định.
        boolean isFirst = addresses.findByUser_IdOrderByDefaultAddressDescCreatedAtDesc(userId).isEmpty();
        if (isFirst || req.isDefault()) {
            clearDefault(userId);
            a.setDefaultAddress(true);
        }
        return addresses.save(a);
    }

    @Transactional
    public UserAddress update(Long userId, Long addressId, UserAddressDto req) {
        UserAddress a = addresses.findByIdAndUser_Id(addressId, userId)
                .orElseThrow(() -> new NotFoundException("Address not found: " + addressId));
        copy(req, a);
        if (req.isDefault() && !a.isDefaultAddress()) {
            clearDefault(userId);
            a.setDefaultAddress(true);
        }
        return addresses.save(a);
    }

    @Transactional
    public void delete(Long userId, Long addressId) {
        UserAddress a = addresses.findByIdAndUser_Id(addressId, userId)
                .orElseThrow(() -> new NotFoundException("Address not found: " + addressId));
        boolean wasDefault = a.isDefaultAddress();
        addresses.delete(a);
        if (wasDefault) {
            // Promote địa chỉ mới nhất còn lại làm default
            addresses.findByUser_IdOrderByDefaultAddressDescCreatedAtDesc(userId).stream()
                    .findFirst()
                    .ifPresent(first -> {
                        first.setDefaultAddress(true);
                        addresses.save(first);
                    });
        }
    }

    @Transactional
    public UserAddress setDefault(Long userId, Long addressId) {
        UserAddress a = addresses.findByIdAndUser_Id(addressId, userId)
                .orElseThrow(() -> new NotFoundException("Address not found: " + addressId));
        clearDefault(userId);
        a.setDefaultAddress(true);
        return addresses.save(a);
    }

    private void clearDefault(Long userId) {
        addresses.findFirstByUser_IdAndDefaultAddressTrue(userId).ifPresent(curr -> {
            curr.setDefaultAddress(false);
            addresses.save(curr);
        });
    }

    private void copy(UserAddressDto src, UserAddress dst) {
        dst.setFullName(src.fullName().trim());
        dst.setPhone(src.phone().trim());
        dst.setLine1(src.line1().trim());
        dst.setWard(src.ward());
        dst.setDistrict(src.district());
        dst.setCity(src.city().trim());
        dst.setNote(src.note());
    }
}
