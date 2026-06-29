# Chức năng theo role: User (khách hàng)

**Role:** `user` (mặc định khi đăng ký)  
**Base URL:** `http://localhost:3000`

User là hành khách: đăng ký, tìm tuyến, mua vé, đánh giá, báo cáo sự cố. **Không** quản lý dữ liệu hệ thống (tuyến, điểm dừng, bài viết).

---

## 1. Xác thực & tài khoản


| #   | Chức năng                                 | Method | Endpoint                              | Auth  |
| --- | ----------------------------------------- | ------ | ------------------------------------- | ----- |
| 1   | Đăng ký tài khoản (gửi OTP qua email)     | POST   | `/api/users/register`                 | Không |
| 2   | Xác nhận OTP và tạo tài khoản             | POST   | `/api/users/register/verify-otp`      | Không |
| 3   | Đăng nhập (nhận JWT token)                | POST   | `/api/users/login`                    | Không |
| 4   | Quên mật khẩu — gửi OTP                   | POST   | `/api/users/forgot-password/send-otp` | Không |
| 5   | Quên mật khẩu — đặt lại mật khẩu bằng OTP | POST   | `/api/users/forgot-password/reset`    | Không |
| 6   | Cập nhật thông tin cá nhân (profile)      | PUT    | `/api/users/profile`                  | Có    |


---

## 2. Upload


| #   | Chức năng                                            | Method | Endpoint             | Auth |
| --- | ---------------------------------------------------- | ------ | -------------------- | ---- |
| 7   | Upload ảnh (ví dụ: minh chứng ưu tiên, ảnh đính kèm) | POST   | `/api/upload/images` | Có   |


---

## 3. Bài viết (Post) — chỉ xem


| #   | Chức năng                                          | Method | Endpoint               | Auth  |
| --- | -------------------------------------------------- | ------ | ---------------------- | ----- |
| 8   | Danh sách bài viết (phân trang, tìm kiếm, sắp xếp) | POST   | `/api/posts/listPosts` | Không |
| 9   | Chi tiết một bài viết                              | GET    | `/api/posts/:id`       | Không |


> Tạo / sửa / xóa bài viết do **admin** quản lý.

---

## 4. Tuyến xe (Route) — chỉ xem


| #   | Chức năng                                       | Method | Endpoint                 | Auth  |
| --- | ----------------------------------------------- | ------ | ------------------------ | ----- |
| 10  | Danh sách tuyến (phân trang, tìm kiếm, sắp xếp) | POST   | `/api/routes/listRoutes` | Không |
| 11  | Chi tiết một tuyến                              | GET    | `/api/routes/detail/:id` | Không |


> Tạo / sửa / xóa tuyến do **admin** quản lý (`userId` trên Route = admin tạo, `staffId` = nhân viên phụ trách).

---

## 5. Điểm dừng (Stop) — chỉ xem


| #   | Chức năng                      | Method | Endpoint                 | Auth  |
| --- | ------------------------------ | ------ | ------------------------ | ----- |
| 12  | Danh sách điểm dừng theo tuyến | POST   | `/api/stops/listByRoute` | Không |
| 13  | Chi tiết một điểm dừng         | GET    | `/api/stops/detail/:id`  | Không |


> Tạo / sửa / xóa điểm dừng do **admin** quản lý (yêu cầu sở hữu tuyến).

---

## 6. Báo cáo sự cố tuyến (Route Report)


| #   | Chức năng                                                 | Method | Endpoint                              | Auth  |
| --- | --------------------------------------------------------- | ------ | ------------------------------------- | ----- |
| 14  | Tạo báo cáo sự cố / góp ý / khiếu nại                     | POST   | `/api/route-reports/create`           | Có    |
| 15  | Cập nhật báo cáo (chỉ báo cáo của mình)                   | PUT    | `/api/route-reports/update/:id`       | Có    |
| 16  | Xóa báo cáo (chỉ báo cáo của mình)                        | DELETE | `/api/route-reports/delete/:id`       | Có    |
| 17  | Danh sách báo cáo (phân trang, lọc status/type, tìm kiếm) | POST   | `/api/route-reports/listRouteReports` | Không |
| 18  | Chi tiết một báo cáo                                      | GET    | `/api/route-reports/detail/:id`       | Có    |


---

## 7. Đánh giá tuyến (Review)


| #   | Chức năng                                                    | Method | Endpoint                   | Auth  |
| --- | ------------------------------------------------------------ | ------ | -------------------------- | ----- |
| 19  | Tạo đánh giá tuyến (rating 1–5)                              | POST   | `/api/reviews/create`      | Có    |
| 20  | Cập nhật đánh giá (chỉ đánh giá của mình)                    | PUT    | `/api/reviews/update/:id`  | Có    |
| 21  | Xóa đánh giá (chỉ đánh giá của mình)                         | DELETE | `/api/reviews/delete/:id`  | Có    |
| 22  | Danh sách đánh giá (phân trang, lọc rating/routeId, sắp xếp) | POST   | `/api/reviews/listReviews` | Không |
| 23  | Chi tiết một đánh giá                                        | GET    | `/api/reviews/detail/:id`  | Không |


---

## 8. Tìm kiếm hành trình (Trip)


| #   | Chức năng                             | Method | Endpoint                             | Auth  |
| --- | ------------------------------------- | ------ | ------------------------------------ | ----- |
| 24  | Gợi ý địa điểm theo từ khóa           | POST   | `/api/suggest-locations?keyword=...` | Không |
| 25  | Tìm hành trình (origin → destination) | POST   | `/api/trips/search`                  | Không |
| 26  | Chi tiết hành trình đã chọn           | POST   | `/api/trips/detail`                  | Không |


---

## 9. Phương thức thanh toán (Payment Method)


| #   | Chức năng                                                   | Method | Endpoint                                  | Auth |
| --- | ----------------------------------------------------------- | ------ | ----------------------------------------- | ---- |
| 27  | Thêm phương thức thanh toán (MoMo, ZaloPay, Visa, Napas, …) | POST   | `/api/payment-methods/create`             | Có   |
| 28  | Cập nhật phương thức thanh toán                             | PUT    | `/api/payment-methods/update/:id`         | Có   |
| 29  | Xem tất cả phương thức thanh toán của bản thân              | GET    | `/api/payment-methods/my-payment-methods` | Có   |


---

## 10. Vé xe (Ticket)


| #   | Chức năng                         | Method | Endpoint              | Auth |
| --- | --------------------------------- | ------ | --------------------- | ---- |
| 30  | Mua vé (tạo ticket, sinh QR code) | POST   | `/api/tickets/create` | Có   |


---

## 11. Hệ thống


| #   | Chức năng                 | Method | Endpoint  | Auth  |
| --- | ------------------------- | ------ | --------- | ----- |
| 31  | Kiểm tra server hoạt động | GET    | `/health` | Không |


---

## User không có quyền


| Chức năng                         | Lý do                                  |
| --------------------------------- | -------------------------------------- |
| Tạo / sửa / xóa tuyến, điểm dừng  | Dữ liệu vận hành — **admin** quản lý   |
| Tạo / sửa / xóa bài viết          | Nội dung tin tức — **admin** quản lý   |
| Quét QR vé                        | Nghiệp vụ **staff** tại cổng / trên xe |
| Báo cáo ca làm việc               | Chỉ **staff** (`/api/shift-reports/`*) |
| Quản lý user, dashboard, duyệt ca | Chỉ **admin** (`/api/admin/`*)         |


> **Lưu ý kỹ thuật:** Một số API route/stop/post hiện chỉ kiểm tra `auth`, chưa có middleware phân role — nhưng theo nghiệp vụ SmartBus, user không được phép thao tác các chức năng trên.

