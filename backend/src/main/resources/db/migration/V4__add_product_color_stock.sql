-- ============================================================
-- Thêm cột stock cho từng variant màu + seed số lượng ban đầu.
-- ============================================================

ALTER TABLE product_color ADD COLUMN stock INT NOT NULL DEFAULT 0;

-- Seed stock: default variants 100, còn lại 50.
UPDATE product_color SET stock = 100 WHERE is_default = TRUE;
UPDATE product_color SET stock = 50  WHERE is_default = FALSE;
