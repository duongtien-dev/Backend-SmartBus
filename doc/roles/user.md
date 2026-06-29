# Chức năng theo role: User (khách hàng)

**Role:** `user` (mặc định khi đăng ký)  
**Base URL:** `http://localhost:3000`

---

## 1. Xác thực & tài khoản

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 1 | Đăng ký tài khoản (gửi OTP qua email) | POST | `/api/users/register` | Không |
| 2 | Xác nhận OTP và tạo tài khoản | POST | `/api/users/register/verify-otp` | Không |
| 3 | Đăng nhập (nhận JWT token) | POST | `/api/users/login` | Không |
| 4 | Quên mật khẩu — gửi OTP | POST | `/api/users/forgot-password/send-otp` | Không |
| 5 | Quên mật khẩu — đặt lại mật khẩu bằng OTP | POST | `/api/users/forgot-password/reset` | Không |
| 6 | Cập nhật thông tin cá nhân (profile) | PUT | `/api/users/profile` | Có |

---

## 2. Upload

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 7 | Upload ảnh (tối đa 5 ảnh, Cloudinary) | POST | `/api/upload/images` | Có |

---

## 3. Bài viết (Post)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 8 | Tạo bài viết | POST | `/api/posts` | Có |
| 9 | Sửa bài viết | PUT | `/api/posts/:id` | Có |
| 10 | Xóa bài viết | DELETE | `/api/posts/:id` | Có |
| 11 | Danh sách bài viết (phân trang, tìm kiếm, sắp xếp) | POST | `/api/posts/listPosts` | Không |
| 12 | Chi tiết một bài viết | GET | `/api/posts/:id` | Không |

---

## 4. Tuyến xe (Route)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 13 | Tạo tuyến mới | POST | `/api/routes/create` | Có |
| 14 | Cập nhật tuyến (chỉ tuyến do mình tạo) | PUT | `/api/routes/update/:id` | Có |
| 15 | Xóa tuyến (chỉ tuyến do mình tạo) | DELETE | `/api/routes/delete/:id` | Có |
| 16 | Danh sách tuyến (phân trang, tìm kiếm, sắp xếp, lọc userId) | POST | `/api/routes/listRoutes` | Không |
| 17 | Chi tiết một tuyến | GET | `/api/routes/detail/:id` | Không |

---

## 5. Điểm dừng (Stop)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 18 | Tạo điểm dừng trên tuyến | POST | `/api/stops/create` | Có |
| 19 | Cập nhật điểm dừng | PUT | `/api/stops/update/:id` | Có |
| 20 | Xóa điểm dừng | DELETE | `/api/stops/delete/:id` | Có |
| 21 | Danh sách điểm dừng theo tuyến | POST | `/api/stops/listByRoute` | Không |
| 22 | Chi tiết một điểm dừng | GET | `/api/stops/detail/:id` | Không |

---

## 6. Báo cáo sự cố tuyến (Route Report)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 23 | Tạo báo cáo sự cố / góp ý / khiếu nại | POST | `/api/route-reports/create` | Có |
| 24 | Cập nhật báo cáo (chỉ báo cáo của mình) | PUT | `/api/route-reports/update/:id` | Có |
| 25 | Xóa báo cáo (chỉ báo cáo của mình) | DELETE | `/api/route-reports/delete/:id` | Có |
| 26 | Danh sách báo cáo (phân trang, lọc status/type/userId, tìm kiếm) | POST | `/api/route-reports/listRouteReports` | Không |
| 27 | Chi tiết một báo cáo | GET | `/api/route-reports/detail/:id` | Có |

---

## 7. Đánh giá tuyến (Review)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 28 | Tạo đánh giá tuyến (rating 1–5) | POST | `/api/reviews/create` | Có |
| 29 | Cập nhật đánh giá | PUT | `/api/reviews/update/:id` | Có |
| 30 | Xóa đánh giá | DELETE | `/api/reviews/delete/:id` | Có |
| 31 | Danh sách đánh giá (phân trang, lọc rating/routeId, sắp xếp) | POST | `/api/reviews/listReviews` | Không |
| 32 | Chi tiết một đánh giá | GET | `/api/reviews/detail/:id` | Không |

---

## 8. Tìm kiếm hành trình (Trip)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 33 | Gợi ý địa điểm theo từ khóa | POST | `/api/suggest-locations?keyword=...` | Không |
| 34 | Tìm hành trình (origin → destination) | POST | `/api/trips/search` | Không |
| 35 | Chi tiết hành trình đã chọn | POST | `/api/trips/detail` | Không |

---

## 9. Phương thức thanh toán (Payment Method)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 36 | Thêm phương thức thanh toán (MoMo, ZaloPay, Visa, Napas, …) | POST | `/api/payment-methods/create` | Có |
| 37 | Cập nhật phương thức thanh toán | PUT | `/api/payment-methods/update/:id` | Có |
| 38 | Xem tất cả phương thức thanh toán của bản thân | GET | `/api/payment-methods/my-payment-methods` | Có |

---

## 10. Vé xe (Ticket)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 39 | Mua vé (tạo ticket, sinh QR code) | POST | `/api/tickets/create` | Có |

---

## 11. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 40 | Kiểm tra server hoạt động | GET | `/health` | Không |

---

## Ghi chú

- User **không** có quyền gọi API `/api/shift-reports/*` (chỉ `staff`).
- User **không** có quyền gọi API `/api/admin/*` (chỉ `admin`).
- API quét QR vé (`/api/tickets/verify-scanned-qr`) yêu cầu đăng nhập nhưng **không** giới hạn role — nghiệp vụ chính dành cho nhân viên (`staff`).
