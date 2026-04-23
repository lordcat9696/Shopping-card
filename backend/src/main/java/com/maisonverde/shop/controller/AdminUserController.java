package com.maisonverde.shop.controller;

import com.maisonverde.shop.dto.UpdateUserRoleRequest;
import com.maisonverde.shop.dto.UserDto;
import com.maisonverde.shop.security.AppUserPrincipal;
import com.maisonverde.shop.service.AdminUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Admin — Users")
@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final AdminUserService service;

    public AdminUserController(AdminUserService service) {
        this.service = service;
    }

    @GetMapping
    public Page<UserDto> list(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return service.search(q, pageable);
    }

    @PatchMapping("/{id}/role")
    public UserDto updateRole(
            @AuthenticationPrincipal AppUserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest req) {
        return service.updateRole(id, principal.getId(), req.role());
    }
}
