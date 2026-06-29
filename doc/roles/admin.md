# Chức năng theo role: Admin (quản trị viên)

**Role:** `admin`  
**Base URL:** `http://localhost:3000`

Admin quản lý toàn bộ hệ thống: dữ liệu tuyến, nội dung, người dùng, thống kê, duyệt báo cáo ca.

---

## 1. Xác thực & tài khoản

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 1 | Đăng nhập (nhận JWT token) | POST | `/api/users/login` | Không |
| 2 | Quên mật khẩu — gửi OTP | POST | `/api/users/forgot-password/send-otp` | Không |
| 3 | Quên mật khẩu — đặt lại mật khẩu | POST | `/api/users/forgot-password/reset` | Không |
| 4 | Cập nhật thông tin cá nhân | PUT | `/api/users/profile` | Có |

---

## 2. Upload

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 5 | Upload ảnh (thumbnail, ảnh bài viết, …) | POST | `/api/upload/images` | Có |

---

## 3. Bài viết (Post) — quản lý nội dung

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 6 | Tạo bài viết (tin tức, thông báo) | POST | `/api/posts` | Có |
| 7 | Sửa bài viết | PUT | `/api/posts/:id` | Có |
| 8 | Xóa bài viết | DELETE | `/api/posts/:id` | Có |
| 9 | Danh sách bài viết | POST | `/api/posts/listPosts` | Không |
| 10 | Chi tiết bài viết | GET | `/api/posts/:id` | Không |

---

## 4. Tuyến xe (Route) — quản lý dữ liệu vận hành

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 11 | Tạo tuyến mới (gán `staffId` cho nhân viên phụ trách) | POST | `/api/routes/create` | Có |
| 12 | Cập nhật tuyến | PUT | `/api/routes/update/:id` | Có |
| 13 | Xóa tuyến | DELETE | `/api/routes/delete/:id` | Có |
| 14 | Danh sách tuyến (phân trang, tìm kiếm, sắp xếp) | POST | `/api/routes/listRoutes` | Không |
| 15 | Chi tiết tuyến | GET | `/api/routes/detail/:id` | Không |

> `userId` trên Route = admin tạo tuyến. `staffId` = nhân viên được gán vận hành.

---

## 5. Điểm dừng (Stop) — quản lý theo tuyến

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 16 | Tạo điểm dừng trên tuyến | POST | `/api/stops/create` | Có |
| 17 | Cập nhật điểm dừng | PUT | `/api/stops/update/:id` | Có |
| 18 | Xóa điểm dừng | DELETE | `/api/stops/delete/:id` | Có |
| 19 | Danh sách điểm dừng theo tuyến | POST | `/api/stops/listByRoute` | Không |
| 20 | Chi tiết điểm dừng | GET | `/api/stops/detail/:id` | Không |

> Stop CRUD yêu cầu admin sở hữu tuyến (`Route.userId` = admin).

---

## 6. Báo cáo sự cố tuyến (Route Report) — xem & xử lý

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 21 | Danh sách báo cáo (lọc status, type, userId, tìm kiếm) | POST | `/api/route-reports/listRouteReports` | Không |
| 22 | Chi tiết báo cáo | GET | `/api/route-reports/detail/:id` | Có |

> Báo cáo do **user** gửi. Admin theo dõi qua danh sách và cập nhật `status` (nếu có quyền sửa báo cáo của user).

---

## 7. Đánh giá tuyến (Review) — xem

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 23 | Danh sách đánh giá | POST | `/api/reviews/listReviews` | Không |
| 24 | Chi tiết đánh giá | GET | `/api/reviews/detail/:id` | Không |

---

## 8. Tìm kiếm hành trình (Trip) — xem / kiểm tra

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 25 | Gợi ý địa điểm | POST | `/api/suggest-locations?keyword=...` | Không |
| 26 | Tìm hành trình | POST | `/api/trips/search` | Không |
| 27 | Chi tiết hành trình | POST | `/api/trips/detail` | Không |

---

## 9. Quản lý người dùng — chỉ admin

Middleware: `requireAdmin` — prefix `/api/admin`.

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 28 | Danh sách user (phân trang, tìm full_name, lọc role / is_priority_user / active) | POST | `/api/admin/users/listUsers` | Admin |
| 29 | Chi tiết một user | GET | `/api/admin/users/detail/:id` | Admin |
| 30 | Bật / tắt trạng thái active (staff / user) | PUT | `/api/admin/users/updateActive/:id` | Admin |
| 31 | Xóa user (không xóa admin, không xóa chính mình) | DELETE | `/api/admin/users/delete/:id` | Admin |

**Ràng buộc:**
- Không đổi `active` của tài khoản `role === 'admin'`.
- Không xóa tài khoản admin.

---

## 10. Dashboard thống kê — chỉ admin

Middleware: `requireAdmin` — prefix `/api/admin/dashboard`.

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 32 | Tổng hợp thống kê hệ thống | POST | `/api/admin/dashboard/summary` | Admin |

**Dữ liệu:** users, posts, routes, routeReports, shiftReports, tickets, stops, scanLogs, time series, top tuyến có nhiều báo cáo.

---

## 11. Duyệt báo cáo ca làm việc — chỉ admin

Middleware: `requireAdmin` — prefix `/api/admin/shift-reports`.

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 33 | Danh sách báo cáo ca (phân trang, lọc status, staffId) | POST | `/api/admin/shift-reports` | Admin |
| 34 | Duyệt hoặc từ chối báo cáo ca (`approved` / `rejected`) | PATCH | `/api/admin/shift-reports/:reportId/review` | Admin |

---

## 12. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 35 | Kiểm tra server hoạt động | GET | `/health` | Không |

---

## Admin không có quyền (theo nghiệp vụ)

| Chức năng | Lý do |
|-----------|--------|
| Báo cáo ca staff (`preview` / `submit` / `my`) | Chỉ **staff** — middleware `requireStaff` |
| Mua vé, quản lý payment method | Nghiệp vụ **user** |
| Tạo đánh giá / báo cáo sự cố | Nghiệp vụ **user** gửi, admin xem xử lý |
| Quét QR vé | Nghiệp vụ **staff** tại điểm vận hành |
