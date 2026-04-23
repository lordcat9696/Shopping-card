-- ============================================================
-- Seed tài khoản admin mặc định để bootstrap dashboard.
-- Thông tin đăng nhập:
--   email:    admin@maisonverde.local
--   password: admin@123
-- IMPORTANT: Đổi password ngay sau khi login lần đầu trên prod.
-- ============================================================

INSERT INTO app_user (email, password_hash, name, provider, role, created_at)
VALUES (
    'admin@maisonverde.local',
    -- bcrypt cost 10 của "admin@123"
    '$2a$10$h5gfdDdQEv04jIvEXPp7keTXntNzS0t2vw1pZC27scLkXvIs/XXve',
    'Admin',
    'LOCAL',
    'ADMIN',
    CURRENT_TIMESTAMP
);
