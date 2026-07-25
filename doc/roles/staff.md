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

**Body listRoutes (staff):** `{ staffId, page?, limit?, sort? }` — lọc tuyến admin đã gán (`Route.staffId`).
| 6 | Chi tiết tuyến | POST | `/api/routes/detail` | Không |
| 7 | Danh sách điểm dừng theo tuyến | POST | `/api/stops/listByRoute` | Không |
| 8 | Chi tiết điểm dừng | POST | `/api/stops/detail` | Không |

---

## 3. Vé xe & quét QR

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 9 | Quét / kiểm tra QR vé | POST | `/api/tickets/verify-scanned-qr` | Có |
| 9b | Lịch sử quét của staff trong khoảng thời gian | POST | `/api/scan-logs/my` | Có (staff) |

**Body my scans:** `{ from: ISO8601, to?: ISO8601, page?, limit? }`

---

## 4. Phiên ca đang chạy (Active Shift)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 16 | Check-in nhận ca | POST | `/api/staff-shifts/check-in` | Có (staff) |
| 17 | Lấy ca đang active | POST | `/api/staff-shifts/active` | Có (staff) |
| 18 | Kết thúc ca (đóng phiên) | POST | `/api/staff-shifts/end` | Có (staff) |

**Body check-in:** `{ scheduleId?, routeId?, routeName?, routeCode? }` — nếu đã có ca active thì trả ca hiện tại. Có `scheduleId` thì lấy tuyến từ lịch ca.

---

## 4b. Lịch ca được giao (Staff Schedule)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 19 | Lịch ca của tôi (mặc định tuần hiện tại) | POST | `/api/staff-schedules/my` | Có (staff) |

**Body my:** `{ from?: ISO8601, to?: ISO8601 }` — `to` là exclusive. Bỏ trống → tuần Mon→Sun.

**Admin tạo lịch:** `POST /api/admin/staff-schedules`  
Body: `{ staffId, workDate, period?: morning|afternoon|evening, startTime?, endTime?, routeId?, plateNumber? }`

---

## 5. Báo cáo ca làm việc (Shift Report)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 10 | Xem thống kê ca trước khi gửi | POST | `/api/shift-reports/preview` | Có (staff) |
| 11 | Gửi báo cáo ca làm việc | POST | `/api/shift-reports/submit` | Có (staff) |
| 12 | Xem lịch sử báo cáo ca của bản thân | POST | `/api/shift-reports/my` | Có (staff) |

---

## 6. Xin nghỉ (Leave Request)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 14 | Gửi đơn xin nghỉ | POST | `/api/leave-requests/submit` | Có (staff) |
| 15 | Danh sách đơn xin nghỉ của bản thân | POST | `/api/leave-requests/my` | Có (staff) |

**Body submit:** `{ startDate, endDate, reason }` — `startDate`/`endDate`: `DD/MM/YYYY` hoặc ISO8601.  
**Body my:** `{ page?, limit?, status?: submitted|approved|rejected }`

---

## 7. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 13 | Kiểm tra server hoạt động | GET | `/health` | Không |
