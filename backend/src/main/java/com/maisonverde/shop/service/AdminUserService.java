package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.UserDto;
import com.maisonverde.shop.entity.Role;
import com.maisonverde.shop.entity.User;
import com.maisonverde.shop.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUserService {

    private final UserRepository users;

    public AdminUserService(UserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public Page<UserDto> search(String q, Pageable pageable) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        return users.search(query, pageable).map(UserDto::from);
    }

    @Transactional
    public UserDto updateRole(Long targetUserId, Long actingAdminId, Role newRole) {
        User target = users.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("User not found: " + targetUserId));
        // Tránh tự giáng cấp nếu đang là ADMIN duy nhất (giảm rủi ro lockout).
        if (target.getId().equals(actingAdminId) && newRole != Role.ADMIN) {
            throw new IllegalArgumentException("Không thể tự hạ quyền ADMIN của chính mình");
        }
        target.setRole(newRole);
        return UserDto.from(users.save(target));
    }
}
