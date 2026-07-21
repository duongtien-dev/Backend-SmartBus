# API Đánh giá tuyến (Review)

**Base URL:** `http://localhost:<PORT>/api/reviews`  
**Auth:** Create / Update / Delete cần header `Authorization: Bearer <token>`. List và Detail không bắt buộc token.

---

## Danh sách API

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| POST | /create | Có | Tạo đánh giá tuyến |
| PUT | /update/:id | Có | Cập nhật đánh giá |
| DELETE | /delete/:id | Có | Xóa đánh giá |
| POST | /listReviews | Không | Danh sách đánh giá (phân trang, lọc rating, sort ngày, lọc theo tuyến) |
| POST | /summary | Không | Tổng hợp đánh giá theo tuyến (average, total, distribution) |
| GET | /detail/:id | Không | Chi tiết một đánh giá |

---

## 1. Tạo đánh giá – POST /api/reviews/create

**Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`

**Body (raw JSON):**

```json
{
  "routeId": "674000000000000000000001",
  "rating": 5,
  "content": "Tuyến rất tiện, xe chạy đúng giờ."
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|--------|
| routeId | Có | ObjectId của tuyến (MongoDB) |
| rating | Có | Số sao từ 1 đến 5 |
| content | Không | Nội dung đánh giá (text) |

---

## 2. Cập nhật đánh giá – PUT /api/reviews/update/:id

**Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`  
**Params:** `id` = ObjectId của review

**Body (raw JSON):**

```json
{
  "rating": 4,
  "content": "Đã sửa: tuyến ổn, đôi khi trễ vài phút."
}
```

Cả hai field đều optional; gửi field nào thì cập nhật field đó.

---

## 3. Xóa đánh giá – DELETE /api/reviews/delete/:id

**Headers:** `Authorization: Bearer <token>`  
**Params:** `id` = ObjectId của review

Không cần body.

---

## 4. Danh sách đánh giá – POST /api/reviews/listReviews

**Headers:** `Content-Type: application/json`

**Body (raw JSON) – ví dụ đầy đủ:**

```json
{
  "page": 1,
  "limit": 10,
  "rating": 5,
  "sort": "newest",
  "routeId": "674000000000000000000001"
}
```

**Body tối thiểu (phân trang mặc định):**

```json
{
  "page": 1,
  "limit": 10
}
```

**Chỉ lọc theo rating (ví dụ 4 sao):**

```json
{
  "page": 1,
  "limit": 20,
  "rating": 4
}
```

**Sắp xếp cũ trước:**

```json
{
  "page": 1,
  "limit": 10,
  "sort": "oldest"
}
```

**Chỉ lấy đánh giá của một tuyến:**

```json
{
  "page": 1,
  "limit": 10,
  "routeId": "674000000000000000000001"
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|--------|
| page | Không | Trang (mặc định 1) |
| limit | Không | Số bản ghi/trang, 1–100 (mặc định 10) |
| rating | Không | Lọc theo số sao: 1, 2, 3, 4 hoặc 5 |
| sort | Không | `"newest"` (mới trước) hoặc `"oldest"` (cũ trước) |
| routeId | Không | Chỉ lấy đánh giá của tuyến có id này |

---

## 5. Tổng hợp đánh giá – POST /api/reviews/summary

**Headers:** `Content-Type: application/json`

**Body:**

```json
{
  "routeId": "674000000000000000000001"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "average": 4.1,
    "total": 10,
    "distribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    }
  }
}
```

---

## 6. Chi tiết đánh giá – GET /api/reviews/detail/:id

**Params:** `id` = ObjectId của review

Không cần body.

---

## Ghi chú Postman

- Thay `<PORT>` bằng port server (ví dụ `3000`).
- Với API cần auth: tab **Authorization** chọn **Bearer Token** và dán token, hoặc thêm header: `Authorization: Bearer <token>`.
- Các request có body: chọn **Body** → **raw** → **JSON**, rồi dán đoạn JSON tương ứng bên trên.
