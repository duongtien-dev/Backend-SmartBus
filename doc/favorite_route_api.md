# API Tuyến yêu thích (Favorite Route)

**Base URL:** `http://localhost:<PORT>/api/route-favorites`  
**Auth:** Tất cả endpoint cần header `Authorization: Bearer <token>`.

---

## Danh sách API

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| POST | /add | Có | Thêm tuyến vào yêu thích |
| POST | /remove | Có | Bỏ yêu thích tuyến |
| POST | /listFavorites | Có | Danh sách tuyến yêu thích của user |

Ngoài ra, `POST /api/routes/listRoutes` (có token) sẽ trả thêm field `isFavorite` trên mỗi tuyến.

---

## 1. Thêm yêu thích – POST /api/route-favorites/add

```json
{
  "routeId": "674000000000000000000001"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đã thêm tuyến vào yêu thích",
  "data": {
    "routeId": "674000000000000000000001",
    "isFavorite": true
  }
}
```

---

## 2. Bỏ yêu thích – POST /api/route-favorites/remove

```json
{
  "routeId": "674000000000000000000001"
}
```

---

## 3. Danh sách yêu thích – POST /api/route-favorites/listFavorites

```json
{
  "page": 1,
  "limit": 10,
  "sort": "newest",
  "search": "Kim Liên"
}
```
