# Chức năng theo role: Admin (quản trị viên)

**Role:** `admin`  
**Base URL:** `http://localhost:3000`

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
| 5 | Upload ảnh | POST | `/api/upload/images` | Có |

---

## 3. Bài viết (Post)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 6 | Tạo bài viết | POST | `/api/posts` | Có |
| 7 | Sửa bài viết | PUT | `/api/posts/:id` | Có |
| 8 | Xóa bài viết | DELETE | `/api/posts/:id` | Có |
| 9 | Danh sách bài viết | POST | `/api/posts/listPosts` | Không |
| 10 | Chi tiết bài viết | GET | `/api/posts/:id` | Không |

---

## 4. Tuyến xe (Route)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 11 | Tạo tuyến mới (gán `staffId`) | POST | `/api/routes/create` | Có |
| 12 | Cập nhật tuyến | PUT | `/api/routes/update/:id` | Có |
| 13 | Xóa tuyến | DELETE | `/api/routes/delete/:id` | Có |
| 14 | Danh sách tuyến | POST | `/api/routes/listRoutes` | Không |
| 15 | Chi tiết tuyến | GET | `/api/routes/detail/:id` | Không |

---

## 5. Điểm dừng (Stop)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 16 | Tạo điểm dừng trên tuyến | POST | `/api/stops/create` | Có |
| 17 | Cập nhật điểm dừng | PUT | `/api/stops/update/:id` | Có |
| 18 | Xóa điểm dừng | DELETE | `/api/stops/delete/:id` | Có |
| 19 | Danh sách điểm dừng theo tuyến | POST | `/api/stops/listByRoute` | Không |
| 20 | Chi tiết điểm dừng | GET | `/api/stops/detail/:id` | Không |

---

## 6. Báo cáo sự cố tuyến (Route Report)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 21 | Danh sách báo cáo (lọc status, type, userId, tìm kiếm) | POST | `/api/route-reports/listRouteReports` | Không |
| 22 | Chi tiết báo cáo | GET | `/api/route-reports/detail/:id` | Có |

---

## 7. Quản lý người dùng

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 23 | Danh sách user (phân trang, lọc role / is_priority_user / active) | POST | `/api/admin/users/listUsers` | Có |
| 24 | Chi tiết một user | GET | `/api/admin/users/detail/:id` | Có |
| 25 | Bật / tắt trạng thái active | PUT | `/api/admin/users/updateActive/:id` | Có |
| 26 | Xóa user | DELETE | `/api/admin/users/delete/:id` | Có |

---

## 8. Dashboard thống kê

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 27 | Tổng hợp thống kê hệ thống | POST | `/api/admin/dashboard/summary` | Có |

---

## 9. Duyệt báo cáo ca làm việc

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 28 | Danh sách báo cáo ca (lọc status, staffId) | POST | `/api/admin/shift-reports` | Có |
| 29 | Duyệt hoặc từ chối báo cáo ca | PATCH | `/api/admin/shift-reports/:reportId/review` | Có |

---

## 10. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 30 | Kiểm tra server hoạt động | GET | `/health` | Không |
