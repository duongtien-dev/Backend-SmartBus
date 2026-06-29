# Chức năng theo role: Staff (nhân viên)

**Role:** `staff`  
**Base URL:** `http://localhost:3000`

Staff có toàn bộ chức năng của **User** (xem `user.md`), cộng thêm các chức năng riêng dưới đây.

---

## 1. Xác thực & tài khoản

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 1 | Đăng nhập (nhận JWT token) | POST | `/api/users/login` | Không |
| 2 | Quên mật khẩu — gửi OTP | POST | `/api/users/forgot-password/send-otp` | Không |
| 3 | Quên mật khẩu — đặt lại mật khẩu bằng OTP | POST | `/api/users/forgot-password/reset` | Không |
| 4 | Cập nhật thông tin cá nhân (profile) | PUT | `/api/users/profile` | Có |

> Tài khoản staff do admin tạo/quản lý — không tự đăng ký qua flow OTP.

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
| 11 | Tạo tuyến mới | POST | `/api/routes/create` | Có |
| 12 | Cập nhật tuyến (gán `staffId` cho nhân viên phụ trách) | PUT | `/api/routes/update/:id` | Có |
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
| 21 | Tạo báo cáo sự cố | POST | `/api/route-reports/create` | Có |
| 22 | Cập nhật báo cáo | PUT | `/api/route-reports/update/:id` | Có |
| 23 | Xóa báo cáo | DELETE | `/api/route-reports/delete/:id` | Có |
| 24 | Danh sách báo cáo | POST | `/api/route-reports/listRouteReports` | Không |
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
| 36 | Xem phương thức thanh toán của bản thân | GET | `/api/payment-methods/my-payment-methods` | Có |

---

## 10. Vé xe & quét QR (nghiệp vụ chính của staff)

| # | Chức năng | Method | Endpoint | Auth | Ghi chú |
|---|-----------|--------|----------|------|---------|
| 37 | Mua vé (nếu cần) | POST | `/api/tickets/create` | Có | |
| 38 | **Quét / kiểm tra QR vé** | POST | `/api/tickets/verify-scanned-qr` | Có | Ghi `ScanLog`, trả `isValid`, `ticket` |

---

## 11. Báo cáo ca làm việc (Shift Report) — **chỉ staff**

Middleware: `requireStaff` — chỉ `role === 'staff'`.

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 39 | Xem thống kê ca trước khi gửi (totalScans, totalRevenue, …) | POST | `/api/shift-reports/preview` | Staff |
| 40 | Gửi báo cáo ca làm việc | POST | `/api/shift-reports/submit` | Staff |
| 41 | Xem lịch sử báo cáo ca của bản thân (phân trang, lọc status) | POST | `/api/shift-reports/my` | Staff |

**Luồng nghiệp vụ:**
1. Kết thúc ca → gọi `preview` xem số liệu tính từ `ScanLog`.
2. Gọi `submit` để gửi báo cáo (trạng thái `submitted`).
3. Admin duyệt (`approved` / `rejected`) → staff xem kết quả qua `my`.

---

## 12. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 42 | Kiểm tra server hoạt động | GET | `/health` | Không |

---

## Quyền bị hạn chế

Staff **không** gọi được:
- `/api/admin/*` — quản lý user, dashboard, duyệt báo cáo ca (chỉ `admin`).
