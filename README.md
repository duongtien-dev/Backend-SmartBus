# Backend Bus

## Location suggestions

`POST /api/suggest-locations` accepts `{ "keyword": "san bay" }` and returns
`data: [{ display_name, lat, lng }]`. Bus stops are matched without Vietnamese
diacritics, using MongoDB or bundled route data when the database is unavailable.
Additional places come from [Photon](https://github.com/komoot/photon), which
supports search-as-you-type. Set `PHOTON_API_URL` to a private Photon `/api/`
endpoint if needed; the default demo server has no availability guarantee.
Remote results are cached for five minutes (up to 100 queries).
If Photon fails, matching stops are still returned. When no fallback matches,
the API returns 503 so clients can display a retry message.

Regression checks: `node --test test/suggestLocation.test.js`.

Node.js (Express + Mongoose) API cho User và Post.

## Cấu trúc dự án

```
backend-bus/
├── config/          # Cấu hình (DB, env)
├── controllers/     # Xử lý request/response
├── middlewares/     # Auth, ...
├── models/          # Mongoose models (User, Post, Otp)
├── routes/          # Định tuyến API
├── services/        # Business logic
├── utils/           # OTP storage, email
├── validations/     # express-validator
├── app.js
├── server.js
└── .env.example
```

## Chạy dự án

```bash
npm install
cp .env.example .env   # Sửa .env
npm run dev
```

## API

### User

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/users/register/send-otp | Gửi OTP đăng ký |
| POST | /api/users/register/verify-otp | Xác nhận OTP và tạo tài khoản |
| POST | /api/users/login | Đăng nhập |
| PUT | /api/users/profile | Cập nhật thông tin (cần token) |

### Post

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/posts | Tạo post (auth) |
| PUT | /api/posts/:id | Sửa post (auth) |
| DELETE | /api/posts/:id | Xóa post (auth) |
| GET | /api/posts | Danh sách (pagination, search, sort) |
| GET | /api/posts/:id | Chi tiết 1 post |

**Query params cho GET /api/posts:**
- `page`, `limit` – phân trang
- `search` – tìm trong title, content, summary
- `sort` – `newest` (mặc định) hoặc `oldest`
"# Backend-SmartBus" 
