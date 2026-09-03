# Chức năng theo role: Admin (quản trị viên)

**Role:** `admin`
**Base URL:** `http://localhost:3000`

---

## 1. Xác thực & tài khoản

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 1 | Đăng nhập (nhận JWT token) | POST | `/api/users/login` | Không |
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
| 24 | Chi tiết một user | POST | `/api/admin/users/detail` | Có |
| 25 | Bật / tắt trạng thái active | POST | `/api/admin/users/updateActive` | Có |
| 26 | Xóa user | POST | `/api/admin/users/delete` | Có |
| 26b | Tạo tài khoản nhân viên (role staff) | POST | `/api/admin/users/createStaff` | Có |

**Body createStaff:** `{ full_name, email, password, phone? }`

---

## 8. Dashboard thống kê

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 27 | Tổng hợp thống kê hệ thống | POST | `/api/admin/dashboard/summary` | Có |

---

## 9. Duyệt báo cáo ca làm việc

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 28 | Danh sách báo cáo ca (lọc status, staffId) | POST | `/api/admin/shift-reports/list` | Có |
| 28b | Chi tiết báo cáo ca | POST | `/api/admin/shift-reports/detail` | Có |
| 29 | Duyệt hoặc từ chối báo cáo ca | POST | `/api/admin/shift-reports/review` | Có |

---

## 9b. Xếp lịch ca staff

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 29b | Tạo lịch ca cho staff | POST | `/api/admin/staff-schedules` | Có |
| 29c | Danh sách lịch ca (theo khoảng ngày) | POST | `/api/admin/staff-schedules/list` | Có |
| 29d | Chi tiết lịch ca | POST | `/api/admin/staff-schedules/detail` | Có |
| 29e | Cập nhật lịch ca (chỉ status scheduled) | POST | `/api/admin/staff-schedules/update` | Có |
| 29f | Hủy lịch ca | POST | `/api/admin/staff-schedules/cancel` | Có |

**Body tạo:** `{ staffId, workDate (ISO), period?: morning|afternoon|evening, startTime?, endTime?, routeId?, plateNumber? }`

---

## 9c. Loại vé (Ticket Product)

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 29g | Danh sách loại vé | POST | `/api/admin/ticket-products/list` | Có |
| 29h | Chi tiết loại vé | POST | `/api/admin/ticket-products/detail` | Có |
| 29i | Tạo loại vé | POST | `/api/admin/ticket-products/create` | Có |
| 29j | Cập nhật loại vé | POST | `/api/admin/ticket-products/update` | Có |
| 29k | Ngưng bán (soft delete) | POST | `/api/admin/ticket-products/delete` | Có |

---

## 9d. Triage báo cáo sự cố

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 29l | Cập nhật status báo cáo sự cố | POST | `/api/admin/route-reports/review` | Có |

**Body:** `{ id, status: new|in_progress|resolved|rejected, reviewNote? }`

---

## 9e. Duyệt đơn xin nghỉ

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 29m | Danh sách đơn nghỉ | POST | `/api/admin/leave-requests/list` | Có |
| 29n | Chi tiết đơn nghỉ | POST | `/api/admin/leave-requests/detail` | Có |
| 29o | Duyệt / từ chối đơn nghỉ | POST | `/api/admin/leave-requests/review` | Có |

---

## 10. Hệ thống

| # | Chức năng | Method | Endpoint | Auth |
|---|-----------|--------|----------|------|
| 30 | Kiểm tra server hoạt động | GET | `/health` | Không |
