# Chức năng theo role: Staff (nhân viên)

**Role:** `staff`  
**Base URL:** `http://localhost:3000`

Staff là nhân viên vận hành: quét vé QR, báo cáo ca làm việc. Tài khoản do **admin** tạo/quản lý — không tự đăng ký qua OTP.

---

## 1. Xác thực & tài khoản


| #   | Chức năng                            | Method | Endpoint                              | Auth  |
| --- | ------------------------------------ | ------ | ------------------------------------- | ----- |
| 1   | Đăng nhập (nhận JWT token)           | POST   | `/api/users/login`                    | Không |
| 2   | Quên mật khẩu — gửi OTP              | POST   | `/api/users/forgot-password/send-otp` | Không |
| 3   | Quên mật khẩu — đặt lại mật khẩu     | POST   | `/api/users/forgot-password/reset`    | Không |
| 4   | Cập nhật thông tin cá nhân (profile) | PUT    | `/api/users/profile`                  | Có    |


---

## 2. Tuyến xe & điểm dừng — chỉ xem


| #   | Chức năng                                         | Method | Endpoint                 | Auth  |
| --- | ------------------------------------------------- | ------ | ------------------------ | ----- |
| 5   | Danh sách tuyến                                   | POST   | `/api/routes/listRoutes` | Không |
| 6   | Chi tiết tuyến (xem tuyến được gán qua `staffId`) | GET    | `/api/routes/detail/:id` | Không |
| 7   | Danh sách điểm dừng theo tuyến                    | POST   | `/api/stops/listByRoute` | Không |
| 8   | Chi tiết điểm dừng                                | GET    | `/api/stops/detail/:id`  | Không |


> Staff được **admin gán** vào tuyến qua field `staffId` trên Route — không tự tạo/sửa tuyến.

---

## 3. Vé xe & quét QR — nghiệp vụ chính


| #   | Chức năng                 | Method | Endpoint                         | Auth |
| --- | ------------------------- | ------ | -------------------------------- | ---- |
| 9   | **Quét / kiểm tra QR vé** | POST   | `/api/tickets/verify-scanned-qr` | Có   |


**Luồng:**

1. Hành khách mua vé → nhận QR.
2. Staff quét QR → backend kiểm tra hợp lệ, ghi `ScanLog`.
3. Số liệu quét dùng để tính báo cáo ca.

---

## 4. Báo cáo ca làm việc (Shift Report) — chỉ staff

Middleware: `requireStaff`.


| #   | Chức năng                                                    | Method | Endpoint                     | Auth  |
| --- | ------------------------------------------------------------ | ------ | ---------------------------- | ----- |
| 10  | Xem thống kê ca trước khi gửi (totalScans, totalRevenue, …)  | POST   | `/api/shift-reports/preview` | Staff |
| 11  | Gửi báo cáo ca làm việc                                      | POST   | `/api/shift-reports/submit`  | Staff |
| 12  | Xem lịch sử báo cáo ca của bản thân (phân trang, lọc status) | POST   | `/api/shift-reports/my`      | Staff |


**Luồng nghiệp vụ:**

1. Kết thúc ca → `preview` (số liệu tính từ `ScanLog` của staff).
2. `submit` → trạng thái `submitted`.
3. Admin duyệt `approved` / `rejected` → staff xem qua `my`.

---

## 5. Hệ thống


| #   | Chức năng                 | Method | Endpoint  | Auth  |
| --- | ------------------------- | ------ | --------- | ----- |
| 13  | Kiểm tra server hoạt động | GET    | `/health` | Không |


---

## Staff không có quyền


| Chức năng                         | Lý do                                                 |
| --------------------------------- | ----------------------------------------------------- |
| Đăng ký tài khoản (OTP)           | Chỉ **user** tự đăng ký; staff do admin cấp           |
| Tạo / sửa / xóa tuyến, điểm dừng  | **Admin** quản lý dữ liệu vận hành                    |
| Tạo / sửa / xóa bài viết          | **Admin** quản lý nội dung                            |
| Mua vé                            | Nghiệp vụ **user** (hành khách)                       |
| Quản lý phương thức thanh toán    | Nghiệp vụ **user**                                    |
| Đánh giá / báo cáo sự cố tuyến    | Nghiệp vụ **user**                                    |
| Tìm hành trình                    | Nghiệp vụ **user** (staff không cần trong flow chính) |
| Quản lý user, dashboard, duyệt ca | Chỉ **admin** (`/api/admin/`*)                        |


