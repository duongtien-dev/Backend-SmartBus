# Chức năng theo role: Admin (quản trị viên)

**Role:** `admin`  
**Base URL:** `http://localhost:3000`

Admin có quyền quản trị hệ thống, cộng với hầu hết API yêu cầu đăng nhập (trừ API chỉ dành cho `staff`).

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
| 5 | Upload ảnh (tối đa 5 ảnh) | POST | `/api/upload/images` | Có |

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
| 11 | Tạo tuyến | POST | `/api/routes/create` | Có |
| 12 | Cập nhật tuyến (gán nhân viên `staffId`) | PUT | `/api/routes/update/:id` | Có |
| 13 | Xóa tuyến | DELETE | `/api/routes/delete/:id` | Có |
| 14 | Danh sách tuyến | POST | `/api/routes/listRoutes` | Không |
| 15 | Chi tiết tuyến | GET | `/api/routes/detail/:id` | Không |

---

## 5. Điểm dừng (Stop)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 16 | Tạo điểm dừng | POST | `/api/stops/create` | Có |
| 17 | Cập nhật điểm dừng | PUT | `/api/stops/update/:id` | Có |
| 18 | Xóa điểm dừng | DELETE | `/api/stops/delete/:id` | Có |
| 19 | Danh sách điểm dừng theo tuyến | POST | `/api/stops/listByRoute` | Không |
| 20 | Chi tiết điểm dừng | GET | `/api/stops/detail/:id` | Không |

---

## 6. Báo cáo sự cố tuyến (Route Report)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 21 | Tạo báo cáo | POST | `/api/route-reports/create` | Có |
| 22 | Cập nhật báo cáo | PUT | `/api/route-reports/update/:id` | Có |
| 23 | Xóa báo cáo | DELETE | `/api/route-reports/delete/:id` | Có |
| 24 | Danh sách báo cáo (lọc status, type, userId) | POST | `/api/route-reports/listRouteReports` | Không |
| 25 | Chi tiết báo cáo | GET | `/api/route-reports/detail/:id` | Có |

---

## 7. Đánh giá tuyến (Review)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 26 | Tạo đánh giá | POST | `/api/reviews/create` | Có |
| 27 | Cập nhật đánh giá | PUT | `/api/reviews/update/:id` | Có |
| 28 | Xóa đánh giá | DELETE | `/api/reviews/delete/:id` | Có |
| 29 | Danh sách đánh giá | POST | `/api/reviews/listReviews` | Không |
| 30 | Chi tiết đánh giá | GET | `/api/reviews/detail/:id` | Không |

---

## 8. Tìm kiếm hành trình (Trip)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 31 | Gợi ý địa điểm | POST | `/api/suggest-locations?keyword=...` | Không |
| 32 | Tìm hành trình | POST | `/api/trips/search` | Không |
| 33 | Chi tiết hành trình | POST | `/api/trips/detail` | Không |

---

## 9. Phương thức thanh toán

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 34 | Thêm phương thức thanh toán | POST | `/api/payment-methods/create` | Có |
| 35 | Cập nhật phương thức thanh toán | PUT | `/api/payment-methods/update/:id` | Có |
| 36 | Xem phương thức thanh toán | GET | `/api/payment-methods/my-payment-methods` | Có |

---

## 10. Vé xe (Ticket)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 37 | Tạo vé | POST | `/api/tickets/create` | Có |
| 38 | Quét / kiểm tra QR vé | POST | `/api/tickets/verify-scanned-qr` | Có |

---

## 11. Quản lý người dùng — **chỉ admin**

Middleware: `requireAdmin` — prefix `/api/admin`.

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 39 | Danh sách user (phân trang, tìm full_name, lọc role / is_priority_user / active) | POST | `/api/admin/users/listUsers` | Admin |
| 40 | Chi tiết một user | GET | `/api/admin/users/detail/:id` | Admin |
| 41 | Bật / tắt trạng thái active của user (staff / user) | PUT | `/api/admin/users/updateActive/:id` | Admin |
| 42 | Xóa user (không xóa admin, không xóa chính mình) | DELETE | `/api/admin/users/delete/:id` | Admin |

**Ràng buộc:**
- Không đổi `active` của tài khoản `role === 'admin'`.
- Không xóa tài khoản admin.

---

## 12. Dashboard thống kê — **chỉ admin**

Middleware: `requireAdmin` — prefix `/api/admin/dashboard`.

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 43 | Tổng hợp thống kê hệ thống | POST | `/api/admin/dashboard/summary` | Admin |

**Dữ liệu trả về gồm:**
- Tổng users / posts / routes / routeReports / shiftReports / tickets / stops
- Users theo role, active/inactive
- Route reports theo status, type
- Shift reports theo status, doanh thu, lượt quét
- Tickets theo status
- Time series theo khoảng thời gian (`from`, `to`, `granularity`: day/week/month)
- Top tuyến có nhiều báo cáo nhất

---

## 13. Duyệt báo cáo ca làm việc — **chỉ admin**

Middleware: `requireAdmin` — prefix `/api/admin/shift-reports`.

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 44 | Danh sách báo cáo ca (phân trang, lọc status, staffId) | POST | `/api/admin/shift-reports` | Admin |
| 45 | Duyệt hoặc từ chối báo cáo ca (`approved` / `rejected`) | PATCH | `/api/admin/shift-reports/:reportId/review` | Admin |

---

## 14. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 46 | Kiểm tra server hoạt động | GET | `/health` | Không |

---

## Quyền bị hạn chế

Admin **không** gọi được API báo cáo ca của nhân viên:
- `/api/shift-reports/preview`
- `/api/shift-reports/submit`
- `/api/shift-reports/my`

(Các API này yêu cầu `role === 'staff'` — middleware `requireStaff`.)
