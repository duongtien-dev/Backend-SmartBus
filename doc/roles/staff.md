# Chức năng theo role: Staff (nhân viên)

**Role:** `staff`
**Base URL:** `http://localhost:3000`

---

## 1. Xác thực & tài khoản

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 1 | Đăng nhập (nhận JWT token) | POST | `/api/users/login` | Không |
---

## 2. Tuyến xe & điểm dừng

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 5 | Danh sách tuyến | POST | `/api/routes/listRoutes` | Không |
| 6 | Chi tiết tuyến | GET | `/api/routes/detail/:id` | Không |
| 7 | Danh sách điểm dừng theo tuyến | POST | `/api/stops/listByRoute` | Không |
| 8 | Chi tiết điểm dừng | GET | `/api/stops/detail/:id` | Không |

---

## 3. Vé xe & quét QR

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 9 | Quét / kiểm tra QR vé | POST | `/api/tickets/verify-scanned-qr` | Có |

---

## 4. Báo cáo ca làm việc (Shift Report)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 10 | Xem thống kê ca trước khi gửi | POST | `/api/shift-reports/preview` | Có |
| 11 | Gửi báo cáo ca làm việc | POST | `/api/shift-reports/submit` | Có |
| 12 | Xem lịch sử báo cáo ca của bản thân | POST | `/api/shift-reports/my` | Có |

---

## 5. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 13 | Kiểm tra server hoạt động | GET | `/health` | Không |
