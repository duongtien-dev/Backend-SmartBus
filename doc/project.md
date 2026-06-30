# SmartBus — Tổng quan dự án Backend

## Dự án là gì?

**Backend-SmartBus** là API backend cho hệ thống **quản lý và vận hành xe buýt thông minh** (Smart Bus). Hệ thống hỗ trợ hành khách tìm tuyến, mua vé điện tử; nhân viên quét vé và báo cáo ca; admin quản lý tuyến, người dùng và thống kê vận hành.

Ứng dụng frontend (web/mobile) kết nối qua REST API — CORS đã cấu hình cho các cổng dev phổ biến (`3000`, `5173`, `8081`, …).

---

## Mục tiêu nghiệp vụ

| Đối tượng | Mục tiêu |
|-----------|----------|
| **Hành khách (user)** | Đăng ký, tìm hành trình, mua vé QR, thanh toán, đánh giá tuyến, báo cáo sự cố |
| **Nhân viên (staff)** | Quét QR vé tại điểm lên/xuống, gửi báo cáo ca làm việc |
| **Quản trị (admin)** | Quản lý tuyến/điểm dừng, tin tức, tài khoản, dashboard thống kê, duyệt báo cáo ca |

---

## Phạm vi chức năng chính

### 1. Tài khoản & xác thực
- Đăng ký qua OTP email, đăng nhập JWT, quên mật khẩu
- Phân quyền 3 role: `user`, `staff`, `admin`

### 2. Tuyến & điểm dừng
- Admin tạo/sửa/xóa tuyến xe và điểm dừng (tọa độ GeoJSON, giờ chạy)
- Gán nhân viên phụ trách tuyến (`staffId`)
- Hành khách xem danh sách và chi tiết tuyến/điểm dừng

### 3. Tìm hành trình (Trip)
- Gợi ý địa điểm theo từ khóa
- Tìm tuyến phù hợp từ điểm đi → điểm đến (có khoảng cách đi bộ tối đa)

### 4. Vé điện tử (Ticket)
- Mua vé (vé lượt, vé tháng một tuyến, vé tháng liên tuyến)
- Sinh mã QR cho từng vé
- Staff quét QR → kiểm tra hợp lệ, ghi `ScanLog`

### 5. Thanh toán
- Lưu phương thức thanh toán của hành khách (MoMo, ZaloPay, Visa, Napas, …)

### 6. Phản hồi & nội dung
- Hành khách đánh giá tuyến (rating 1–5)
- Báo cáo sự cố / góp ý / khiếu nại trên tuyến
- Admin quản lý bài viết tin tức, thông báo

### 7. Báo cáo ca làm việc (Shift Report)
- Staff xem thống kê ca (lượt quét, doanh thu) và gửi báo cáo
- Admin xem danh sách và duyệt / từ chối báo cáo

### 8. Quản trị hệ thống
- Quản lý user (danh sách, active/inactive, xóa)
- Dashboard tổng hợp: users, vé, báo cáo, doanh thu, time series

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (`jsonwebtoken`) |
| Validation | express-validator |
| Email OTP | Nodemailer / SMTP |
| Upload ảnh | Multer + Cloudinary |
| QR vé | qrcode |

---

## Cấu trúc thư mục

```
Backend-SmartBus/
├── src/
│   ├── config/          # DB, biến môi trường
│   ├── controllers/     # Xử lý HTTP request/response
│   ├── middlewares/     # auth, requireAdmin, requireStaff, upload
│   ├── models/          # Mongoose schema
│   ├── routes/          # Định tuyến API
│   ├── services/        # Business logic
│   ├── utils/           # email, cloudinary, geo, apiResponse, …
│   └── validations/     # express-validator rules
├── doc/                 # Tài liệu API & nghiệp vụ
├── json/                # Dữ liệu mẫu (routes, stops)
├── app.js
└── server.js
```

---

## Model dữ liệu chính

| Model | Mô tả ngắn |
|-------|------------|
| `User` | Tài khoản (role, profile, ưu tiên) |
| `Route` | Tuyến xe |
| `Stop` | Điểm dừng trên tuyến |
| `Ticket` | Vé điện tử + QR |
| `ScanLog` | Lịch sử quét QR |
| `PaymentMethod` | Phương thức thanh toán |
| `Review` | Đánh giá tuyến |
| `RouteReport` | Báo cáo sự cố tuyến |
| `ShiftReport` | Báo cáo ca nhân viên |
| `Post` | Bài viết tin tức |

---

## Tài liệu liên quan

| File | Nội dung |
|------|----------|
| [roles/user.md](./roles/user.md) | Chức năng role hành khách |
| [roles/staff.md](./roles/staff.md) | Chức năng role nhân viên |
| [roles/admin.md](./roles/admin.md) | Chức năng role quản trị |
| [flow-api-ticket.md](./flow-api-ticket.md) | Luồng mua vé & quét QR |
| [flow-api-shift-report.md](./flow-api-shift-report.md) | Luồng báo cáo ca |
| [admin_api.md](./admin_api.md) | API quản lý user |
| [POSTMAN_API.md](./POSTMAN_API.md) | Test case Postman cơ bản |

---

## Chạy dự án

```bash
npm install
cp .env.example .env   # Cấu hình MONGODB_URI, JWT_SECRET, SMTP, Cloudinary
npm run dev
```

Health check: `GET /health`

Base URL API: `http://localhost:<PORT>/api`
