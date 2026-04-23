package com.maisonverde.shop.repository;

import com.maisonverde.shop.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByUser_IdOrderByDefaultAddressDescCreatedAtDesc(Long userId);
    Optional<UserAddress> findByIdAndUser_Id(Long id, Long userId);
    Optional<UserAddress> findFirstByUser_IdAndDefaultAddressTrue(Long userId);
}
