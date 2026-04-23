# CLAUDE.md

Tài liệu hướng dẫn Claude khi làm việc trong repo này. Đọc kỹ trước khi thực hiện bất kỳ thay đổi code nào.

---

## 1. Dự án

Website bán hàng (e-commerce) lấy cảm hứng thiết kế từ **periodaisle.com** (xem file ảnh tham chiếu ở root: `periodaisle.com__ref=godly (1).png`).

Mục tiêu brand: minimalist, editorial, sustainable, cao cấp nhưng thân thiện.

## 2. Design system

Tất cả UI phải nhất quán với ngôn ngữ thiết kế dưới đây. Khi thêm component mới, luôn tham chiếu bảng này trước khi tự chế biến thể mới.

### Màu sắc (định nghĩa ở `frontend/src/index.css` @theme)
| Token               | Giá trị      | Dùng cho                              |
|---------------------|--------------|---------------------------------------|
| `--color-bg`        | `#F4EEDE`    | Nền trang (cream/off-white)           |
| `--color-surface`   | `#FFFFFF`    | Card, modal                           |
| `--color-primary`   | `#1F3D2F`    | Xanh rêu đậm — header, footer, CTA    |
| `--color-accent`    | `#9DC88D`    | Nhấn phụ                              |
| `--color-accent-bright` | `#C5E17A` | Badge "New"/"Sale", highlight nổi bật |
| `--color-text`      | `#1A1A1A`    | Body text                             |
| `--color-muted`     | `#6B6B6B`    | Secondary text, meta                  |
| `--color-border-soft` | `#E3DCC9`  | Divider nhẹ                           |

### Typography
- **Headline**: Archivo (variable), uppercase, letter-spacing hơi thoáng. Utility `font-display`.
- **Body**: Inter. Default.
- **Scale**: `display (clamp 48–96px)` · `h1 40` · `h2 32` · `h3 24` · `body 16` · `small 13`.

### Layout
- Max-width container `1280px`, padding ngang `clamp(20px, 4vw, 56px)`.
- Generous whitespace — không nhồi component.
- Hover state chậm và nhẹ (transform 200ms, không bounce).

## 3. Tech stack

**Frontend** — React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui
- Router: React Router v7 (nested routes cho admin dashboard)
- Data fetching: TanStack Query v5
- HTTP client: axios (có request/response interceptors cho JWT + auto-logout khi 401)
- State:
  - **Zustand** — cart, auth, toast stores. Không dùng persist cho cart (BE là source of truth).
- Forms: plain controlled inputs + manual validation (không dùng react-hook-form/zod để giảm deps).
- Charts: **Chart.js + react-chartjs-2** (dùng ở admin reports).
- Vietnam location picker: API public https://provinces.open-api.vn (miễn phí, không cần key).

**Backend** — Java Spring Boot 3.5 + Java 21 (LTS)
- Build: Maven (wrapper kèm repo)
- Core: Spring Web · Spring Data JPA · Spring Validation · Spring Boot DevTools
- **Security**:
  - Spring Security + JWT stateless (jjwt 0.12.6)
  - Google OAuth2 ID token verification (google-api-client 2.6.0)
  - BCrypt password hashing
  - Role-based guard: `ROLE_USER` / `ROLE_SUB_ADMIN` / `ROLE_ADMIN`
- **Database**: PostgreSQL (docker + prod), schema quản bằng **Flyway**.
- **Mail**: spring-boot-starter-mail (SMTP qua env vars, dev mode log ra console).
- API docs: springdoc-openapi (Swagger UI tại `/swagger-ui.html`).

**Shared contract**
- REST JSON, base path `/api/v1/...`
- CORS mở cho `http://localhost:5174` trong dev (xem `config/CorsConfig.java`).
- Pagination kiểu Spring `Page<>` — FE đọc `content / totalPages / totalElements / number / size`.
- Auth: `Authorization: Bearer <jwt>` header.
- Timezone: `Asia/Ho_Chi_Minh` cho date aggregation (reports).

### Env vars quan trọng
| Var | Mặc định | Mục đích |
|---|---|---|
| `JWT_SECRET` | dev placeholder | HS256 secret, prod bắt buộc đổi |
| `GOOGLE_CLIENT_ID` | dev client id | Google OAuth |
| `MAIL_ENABLED` | `false` | `true` = gửi email thật, `false` = log console |
| `MAIL_HOST/PORT/USERNAME/PASSWORD` | MailHog localhost | SMTP config |
| `MAIL_FROM` | dev placeholder | Sender |
| `VITE_GOOGLE_CLIENT_ID` (FE) | — | Phải copy sang `frontend/.env.local` |

### Commands

**Frontend** (cd `frontend/`):
```
npm install
npm run dev           # http://localhost:5174 (Vite proxy /api → :8080)
npm run build         # tsc -b && vite build → dist/
npm run lint
```

**Backend** (cd `backend/`, cần Java 21 — https://adoptium.net/temurin/releases/?version=21):
```
# Default profile = docker (dùng Postgres ở docker-compose)
./mvnw spring-boot:run

# Prod profile — Postgres qua env vars
SPRING_PROFILES_ACTIVE=prod \
SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/shop \
SPRING_DATASOURCE_USERNAME=... \
SPRING_DATASOURCE_PASSWORD=... \
./mvnw spring-boot:run
```

Shared URLs:
- `http://localhost:8080/api/v1/...`
- `http://localhost:8080/swagger-ui.html` — Swagger UI đầy đủ các tag (Auth, Products, Cart, Orders, User Addresses, Admin — Orders/Products/Users/Inventory).

**Docker Postgres + MailHog** (`docker-compose.yml`):
```
docker compose up -d                      # Postgres :5432
docker compose --profile tools up -d      # + pgAdmin :5050
docker compose --profile mail up -d       # + MailHog :1025 SMTP, :8025 Web UI (nếu có)
docker compose down                       # stop, giữ data
docker compose down -v                    # stop, wipe volume
```

Creds Postgres match sẵn với `application-docker.yml` (user=shop, pw=shoppass, db=shop).

### Seed / bootstrap admin
Flyway seed tài khoản admin mặc định ở `V3__seed_admin_user.sql`:
- email: `admin@maisonverde.local`
- password: `admin@123`

Đổi password ngay sau khi login lần đầu trên môi trường thật.

## 5. Tính năng đã có

### User-facing
- **Browse**: trang chủ, list sản phẩm có pagination (12/trang) + search inline (debounce 300ms, sync URL `?q=&page=`).
- **Search**: thanh tìm kiếm ở Header (dropdown live kết quả) + trên ProductListPage.
- **Product detail**: gallery 5 ảnh (hero + 4 thumb), color swatch, quantity, hiện stock status ("Còn N" / "Còn N - sắp hết" / "Hết hàng"), disable button khi hết.
- **Authentication**:
  - Email/password register + login (JWT 1h).
  - Google Sign-In (Google Identity Services + BE verify ID token).
  - `/auth/me` hydrate khi app mount.
- **Cart** (bắt buộc login mới add được):
  - Lazy-create ở BE khi add item đầu tiên.
  - Cart gắn với user, logout không mất — login lại load từ BE.
  - Self-heal khi cartId stale (403/404 → fetch `/cart/my` retry).
  - Toast báo "Đã thêm / Không đủ hàng / Thêm thất bại".
- **Checkout**:
  - Chọn/thêm/sửa địa chỉ từ address book.
  - Vietnam location picker (3 cascading selects: tỉnh/quận/phường qua provinces.open-api.vn).
  - Phone validation (`(0|\+84)\d{9,10}`) ở FE + BE.
  - Payment: COD hoặc BANK_TRANSFER (chưa tích hợp gateway thật).
  - Shipping fee flat 30k VND.
- **Order**:
  - Confirm page hiện mã đơn, status, địa chỉ, items, payment.
  - Order history ở `/account`.
  - **User cancel đơn** (chỉ PENDING/CONFIRMED) — tự hoàn stock.
- **Address book**: CRUD + set default (max 1 default/user).
- **Email notifications**: order confirmation + status update (async, MailHog cho dev, SMTP prod).
- **UX**: scroll-to-top khi đổi route, toast system (success/error/info), ScrollToTop component.

### Admin dashboard (`/admin`, role ADMIN hoặc SUB_ADMIN)
- **Đơn hàng**: list với filter status (mặc định PENDING), search theo code/email/tên, pagination. Modal chi tiết đơn. Transition status theo workflow (PENDING → CONFIRMED → SHIPPING → DELIVERED, hoặc → CANCELLED). Cancel tự hoàn stock.
- **Báo cáo**: bar chart số đơn theo ngày (Chart.js), filter date range (max 1 năm) + status. Summary: tổng đơn, tổng doanh thu, TB/đơn. Status breakdown progress bars.
- **Sản phẩm**: CRUD đầy đủ qua modal form.
- **Kho**: list tất cả variants, filter "Hết hàng/Sắp hết", inline edit stock per variant. Stats cards tổng quan.
- **Phân quyền (ADMIN only)**: list user với search, đổi role. Chặn self-downgrade để tránh lockout.

### Security
- Whitelist public endpoints (auth, products, categories, Swagger, h2-console, error).
- Cart / Order / Address endpoints yêu cầu Bearer token, thêm ownership check (user chỉ thao tác cart/order của mình).
- `/api/v1/admin/users/**` → ADMIN-only.
- `/api/v1/admin/**` → ADMIN hoặc SUB_ADMIN.
- `AccessDeniedException` → 403 qua GlobalExceptionHandler.

## 6. Nguyên tắc làm việc

- **Ngôn ngữ**: giao tiếp với user bằng tiếng Việt. Code, identifier, commit message bằng tiếng Anh.
- **Không over-engineer**: không thêm abstraction, fallback, hay tính năng ngoài yêu cầu.
- **Hỏi trước khi chọn stack / cài package lớn / đổi thư mục gốc.**
- **Ưu tiên sửa file có sẵn** thay vì tạo file mới.
- **Không tạo file markdown / docs** (README, NOTES, ...) trừ khi user yêu cầu rõ.
- **Ảnh sản phẩm**: để ở `public/products/` với tên kebab-case. Gallery: `public/products/<slug>/1..5.jpg`.
- **Commit**: conventional commits (`feat:`, `fix:`, `style:`, `chore:`) — chỉ commit khi user yêu cầu.

### Pattern kiến trúc BE
- Controller **thin**: chỉ routing + validate input + check auth + forward. Không có `@Transactional`, không map DTO.
- Service **fat**: business logic + `@Transactional` + DTO mapping (ở trong scope transaction để LAZY collection load được).
- Repository: data access, `@EntityGraph` để tránh N+1. Chú ý `MultipleBagFetchException` khi fetch 2 `List<>` cùng query — tách bằng LAZY trong `@Transactional` method.

### Pattern FE
- Auth token set vào axios interceptor từ authStore; 401 response → auto-logout.
- TanStack Query cho server state; mutation tự invalidate cache.
- Toast qua `toast.success/error/info(msg)` — global `<Toaster />` ở App.
- Không cần scroll-to-top thủ công mỗi route, có component `<ScrollToTop />` tự handle.

## 7. Khi thay đổi UI

- Luôn chạy dev server và mở trình duyệt kiểm tra bằng mắt trước khi báo "xong".
- Test responsive: mobile (375px), tablet (768px), desktop (1440px).
- Kiểm tra cả trạng thái rỗng (giỏ hàng trống, không có sản phẩm, không có đơn) và trạng thái đầy.

## 8. Asset tham chiếu

- `periodaisle.com__ref=godly (1).png` — screenshot design mẫu. Đối chiếu khi làm hero, product grid, category section.

---

**Trạng thái hiện tại** (2026-04):
- MVP đầy đủ: catalog + cart + checkout + order + admin dashboard + email notifications + stock management.
- **Chưa có**: forgot password, payment gateway thật, size variant (chỉ color), product reviews thật (UI mock), wishlist, image upload cho admin, guest checkout.

**Gợi ý next phase** (user chọn):
1. Forgot password / reset password flow.
2. VNPay hoặc Momo integration.
3. Size variant (refactor ProductColor → ProductVariant).
4. Product reviews backed by DB.
5. Wishlist.
6. Image upload (vs gõ URL thủ công).
