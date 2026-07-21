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
| 7 | Upload ảnh | POST | `/api/upload/images` | Có |

---

## 3. Bài viết (Post)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 8 | Danh sách bài viết (phân trang, tìm kiếm, sắp xếp) | POST | `/api/posts/listPosts` | Không |
| 9 | Chi tiết một bài viết | GET | `/api/posts/:id` | Không |

---

## 4. Tuyến xe (Route)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 10 | Danh sách tuyến (phân trang, tìm kiếm, sắp xếp; có token thì kèm `isFavorite`) | POST | `/api/routes/listRoutes` | Không |
| 11 | Chi tiết một tuyến | POST | `/api/routes/detail` | Không |
| 11a | Thêm tuyến yêu thích | POST | `/api/route-favorites/add` | Có |
| 11b | Bỏ tuyến yêu thích | POST | `/api/route-favorites/remove` | Có |
| 11c | Danh sách tuyến yêu thích | POST | `/api/route-favorites/listFavorites` | Có |

---

## 5. Điểm dừng (Stop)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 12 | Danh sách điểm dừng theo tuyến | POST | `/api/stops/listByRoute` | Không |
| 13 | Chi tiết một điểm dừng | GET | `/api/stops/detail/:id` | Không |

---

## 6. Báo cáo sự cố tuyến (Route Report)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 14 | Tạo báo cáo sự cố / góp ý / khiếu nại | POST | `/api/route-reports/create` | Có |
| 15 | Cập nhật báo cáo (chỉ báo cáo của mình) | PUT | `/api/route-reports/update/:id` | Có |
| 16 | Xóa báo cáo (chỉ báo cáo của mình) | DELETE | `/api/route-reports/delete/:id` | Có |
| 17 | Danh sách báo cáo (phân trang, lọc status/type, tìm kiếm) | POST | `/api/route-reports/listRouteReports` | Không |
| 18 | Chi tiết một báo cáo | GET | `/api/route-reports/detail/:id` | Có |

---

## 7. Đánh giá tuyến (Review)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 19 | Tạo đánh giá tuyến (rating 1–5) | POST | `/api/reviews/create` | Có |
| 20 | Cập nhật đánh giá (chỉ đánh giá của mình) | PUT | `/api/reviews/update/:id` | Có |
| 21 | Xóa đánh giá (chỉ đánh giá của mình) | DELETE | `/api/reviews/delete/:id` | Có |
| 22 | Danh sách đánh giá (phân trang, lọc rating/routeId, sắp xếp) | POST | `/api/reviews/listReviews` | Không |
| 22a | Tổng hợp đánh giá theo tuyến | POST | `/api/reviews/summary` | Không |
| 23 | Chi tiết một đánh giá | GET | `/api/reviews/detail/:id` | Không |

---

## 8. Tìm kiếm hành trình (Trip)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 24 | Gợi ý địa điểm theo từ khóa | POST | `/api/suggest-locations?keyword=...` | Không |
| 25 | Tìm hành trình (origin → destination) | POST | `/api/trips/search` | Không |
| 26 | Chi tiết hành trình đã chọn | POST | `/api/trips/detail` | Không |

---

## 9. Phương thức thanh toán (Payment Method)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 27 | Thêm phương thức thanh toán | POST | `/api/payment-methods/create` | Có |
| 28 | Cập nhật phương thức thanh toán | PUT | `/api/payment-methods/update/:id` | Có |
| 29 | Xem phương thức thanh toán của bản thân | GET | `/api/payment-methods/my-payment-methods` | Có |

---

## 10. Vé xe (Ticket)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 30 | Mua vé (tạo ticket, sinh QR code) | POST | `/api/tickets/create` | Có |

---

## 11. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 31 | Kiểm tra server hoạt động | GET | `/health` | Không |
