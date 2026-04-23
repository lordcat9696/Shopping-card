-- ============================================================
-- Seed dữ liệu catalog: 5 categories + 10 products + colors + 5 images/sp.
-- Flyway chạy 1 lần; không cần idempotent guards.
-- ============================================================

-- -------------------- CATEGORIES ------------------
INSERT INTO category (slug, name, description) VALUES
    ('ao-thun',    'Áo thun',    'Áo thun thể thao / chạy bộ, nam và nữ.'),
    ('ao-polo',    'Áo polo',    'Áo polo thoáng khí, đa dụng từ sân pickleball đến phố.'),
    ('ao-tanktop', 'Áo tanktop', 'Áo ba lỗ / tanktop cho thể thao và tập luyện cường độ cao.'),
    ('quan-short', 'Quần short', 'Quần shorts thể thao, chạy bộ, pickleball.'),
    ('vay',        'Váy',        'Váy thể thao nữ, cut dáng A.');

-- -------------------- PRODUCTS --------------------
INSERT INTO product (slug, name, description, material, price, sale_price, badge, silhouette, image_url, category_id)
SELECT v.slug, v.name, v.description, v.material, v.price, v.sale_price, v.badge, v.silhouette, v.image_url, c.id
FROM (VALUES
    ('ao-tanktop-pickleball-driveshot',
     'Áo tanktop Pickleball Driveshot Essentials',
     'Áo tanktop thoáng khí thiết kế cho sân pickleball, co giãn 4 chiều, thấm hút nhanh.',
     'Polyester Exdry', 249000, NULL, 'Bán chạy', 'brief',
     '/products/ao-tanktop-pickleball-driveshot.jpg', 'ao-tanktop'),
    ('short-nam-6inch-pickleball-smash',
     'Short nam 6inch Pickleball Smash Shot',
     'Quần short nam 6 inch, vải Exdry siêu nhẹ, túi sâu tiện dụng cho pickleball.',
     'Polyester mesh', 299000, NULL, 'Bán chạy', 'boyshort',
     '/products/short-nam-6inch-pickleball-smash.jpg', 'quan-short'),
    ('vay-knit-aline-pickleball',
     'Váy thun knit Aline Pickleball Essentials',
     'Váy dáng A kết hợp quần bên trong, vải knit mềm mát, chuẩn sân pickleball nữ.',
     'Knit 2-layer', 449000, NULL, NULL, 'chill',
     '/products/vay-knit-aline-pickleball.jpg', 'vay'),
    ('tshirt-chay-bo-nu-exdry-aerodot',
     'T-shirt chạy bộ nữ Exdry AeroDot Gradient',
     'Áo chạy bộ nữ họa tiết gradient, lỗ thoát nhiệt AeroDot tại vùng mồ hôi.',
     'Exdry Aerodot', 299000, NULL, 'New', 'brief',
     '/products/tshirt-chay-bo-nu-exdry-aerodot.jpg', 'ao-thun'),
    ('tshirt-the-thao-nam-flexline',
     'T-shirt thể thao nam FlexLine Active',
     'Áo thể thao nam vải FlexLine co giãn đa chiều, phom regular-fit.',
     'FlexLine', 299000, 259000, '-13%', 'brief',
     '/products/tshirt-the-thao-nam-flexline.jpg', 'ao-thun'),
    ('ao-thun-chay-bo-nam-airflow',
     'Áo thun chạy bộ nam Airflow Exdry Gradient',
     'Áo chạy bộ nam vải Airflow siêu nhẹ, gradient màu cam nổi bật.',
     'Airflow Exdry', 299000, NULL, NULL, 'brief',
     '/products/ao-thun-chay-bo-nam-airflow.jpg', 'ao-thun'),
    ('quan-short-nu-chay-bo-pace-3-5in',
     'Quần shorts nữ chạy bộ 2 lớp Pace Shorts 3.5IN',
     'Shorts nữ 3.5 inch, 2 lớp (quần trong liền), túi điện thoại hông, thoải mái chạy bộ.',
     'Light mesh 2-layer', 449000, 399000, 'Bán chạy', 'boyshort',
     '/products/quan-short-nu-chay-bo-pace-3-5in.jpg', 'quan-short'),
    ('ao-polo-nu-pickleball-exdry',
     'Áo polo nữ Pickleball Exdry Essentials',
     'Polo nữ thoáng khí Exdry, cổ bẻ thanh lịch, phù hợp sân pickleball và đời thường.',
     'Exdry pique', 359000, NULL, NULL, 'brief',
     '/products/ao-polo-nu-pickleball-exdry.jpg', 'ao-polo'),
    ('ao-thun-nam-pickleball-dinkshot',
     'Áo thun nam Pickleball Dinkshot Essentials',
     'Áo thun nam pickleball, chất liệu thấm hút nhanh, phom vận động.',
     'Exdry', 279000, NULL, NULL, 'brief',
     '/products/ao-thun-nam-pickleball-dinkshot.jpg', 'ao-thun'),
    ('ao-thun-chay-bo-nam-luman-gradient',
     'Áo thun chạy bộ nam Luman Gradient',
     'Áo chạy bộ nam họa tiết gradient Luman, phản quang nhẹ cho buổi chạy chiều.',
     'Luman Exdry', 279000, NULL, NULL, 'brief',
     NULL, 'ao-thun')
) AS v(slug, name, description, material, price, sale_price, badge, silhouette, image_url, cat_slug)
JOIN category c ON c.slug = v.cat_slug;

-- -------------------- PRODUCT COLORS --------------
INSERT INTO product_color (product_id, name, hex_code, is_default)
SELECT p.id, v.name, v.hex, v.def
FROM product p
JOIN (VALUES
    ('ao-tanktop-pickleball-driveshot', 'Navy',     '#1F2A48', TRUE),
    ('ao-tanktop-pickleball-driveshot', 'Đen',      '#1A1A1A', FALSE),
    ('ao-tanktop-pickleball-driveshot', 'Xám',      '#8A8A8A', FALSE),
    ('short-nam-6inch-pickleball-smash', 'Đen',     '#1A1A1A', TRUE),
    ('short-nam-6inch-pickleball-smash', 'Navy',    '#1F2A48', FALSE),
    ('short-nam-6inch-pickleball-smash', 'Xanh lá', '#6B9E63', FALSE),
    ('vay-knit-aline-pickleball', 'Trắng',          '#F4EEDE', TRUE),
    ('vay-knit-aline-pickleball', 'Đen',            '#1A1A1A', FALSE),
    ('vay-knit-aline-pickleball', 'Hồng',           '#E8A6B8', FALSE),
    ('tshirt-chay-bo-nu-exdry-aerodot', 'Hồng',     '#E8A6B8', TRUE),
    ('tshirt-chay-bo-nu-exdry-aerodot', 'Xanh',     '#4A7AC7', FALSE),
    ('tshirt-chay-bo-nu-exdry-aerodot', 'Trắng',    '#F4EEDE', FALSE),
    ('tshirt-the-thao-nam-flexline', 'Đen',         '#1A1A1A', TRUE),
    ('tshirt-the-thao-nam-flexline', 'Xám',         '#8A8A8A', FALSE),
    ('tshirt-the-thao-nam-flexline', 'Navy',        '#1F2A48', FALSE),
    ('tshirt-the-thao-nam-flexline', 'Trắng',       '#F4EEDE', FALSE),
    ('ao-thun-chay-bo-nam-airflow', 'Cam',          '#F0894A', TRUE),
    ('ao-thun-chay-bo-nam-airflow', 'Đen',          '#1A1A1A', FALSE),
    ('ao-thun-chay-bo-nam-airflow', 'Xanh lá',      '#6B9E63', FALSE),
    ('quan-short-nu-chay-bo-pace-3-5in', 'Đen',     '#1A1A1A', TRUE),
    ('quan-short-nu-chay-bo-pace-3-5in', 'Hồng',    '#E8A6B8', FALSE),
    ('quan-short-nu-chay-bo-pace-3-5in', 'Xanh',    '#4A7AC7', FALSE),
    ('ao-polo-nu-pickleball-exdry', 'Trắng',        '#F4EEDE', TRUE),
    ('ao-polo-nu-pickleball-exdry', 'Đen',          '#1A1A1A', FALSE),
    ('ao-polo-nu-pickleball-exdry', 'Hồng',         '#E8A6B8', FALSE),
    ('ao-thun-nam-pickleball-dinkshot', 'Xám',      '#8A8A8A', TRUE),
    ('ao-thun-nam-pickleball-dinkshot', 'Đen',      '#1A1A1A', FALSE),
    ('ao-thun-nam-pickleball-dinkshot', 'Navy',     '#1F2A48', FALSE),
    ('ao-thun-chay-bo-nam-luman-gradient', 'Tím',   '#8E6DA4', TRUE),
    ('ao-thun-chay-bo-nam-luman-gradient', 'Đen',   '#1A1A1A', FALSE),
    ('ao-thun-chay-bo-nam-luman-gradient', 'Xanh',  '#4A7AC7', FALSE)
) AS v(slug, name, hex, def) ON v.slug = p.slug;

-- -------------------- PRODUCT IMAGES --------------
-- 5 ảnh/sp, convention /products/<slug>/1..5.jpg, alt + sort_order tự sinh.
INSERT INTO product_image (product_id, url, alt, sort_order)
SELECT p.id,
       CONCAT('/products/', p.slug, '/', v.idx, '.jpg'),
       CONCAT(p.name, ' - view ', v.idx),
       v.idx - 1
FROM product p
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS v(idx);
