# 🔧 Các Lỗi Đã Sửa & Cách Test

## ✅ Những gì đã sửa:

### 1. **Sửa API Endpoints trong Frontend** ⚠️ **LỖI QUAN TRỌNG**

**File:** `client/src/services/postService.js`

**Vấn đề:**

- Frontend gọi `/posts` nhưng backend API là `/api/posts`
- Dẫn đến tất cả API calls bị 404 Not Found

**Đã sửa:**

```javascript
// Trước: "/posts"
// Sau:  "/api/posts"

getAllPosts()    → "/api/posts"
getPostById()    → "/api/posts/{id}"
createPost()     → "/api/posts"
updatePost()     → "/api/posts/{id}"
deletePost()     → "/api/posts/{id}"
getPostsByUser() → "/api/posts/user/{userId}"
```

### 2. **Tạo Auth Service** ✨ **MỚI**

**File:** `client/src/services/authService.js` (file mới)

**Chức năng:**

- `register(userData)` - Đăng ký user mới
- `login(credentials)` - Đăng nhập
- `logout()` - Đăng xuất
- `getCurrentUser()` - Lấy thông tin user hiện tại
- `isAuthenticated()` - Kiểm tra đã đăng nhập chưa
- `getToken()` - Lấy JWT token
- `getUser()` - Lấy user info từ localStorage

### 3. **Update Axios Interceptor để Auto-add Token** 🔐

**File:** `client/src/api/axios.js`

**Đã thêm:**

```javascript
// Request interceptor - Auto thêm Bearer token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  ...
);
```

**Lợi ích:** Không cần manually thêm token vào mỗi request, axios tự động làm!

---

## 🧪 Cách Test

### **Cách 1: Dùng Test Script (Khuyên dùng)**

Chạy file `test-api.ps1`:

```powershell
.\test-api.ps1
```

Script sẽ test:
✅ Backend health check
✅ User registration
✅ User login
✅ Create post
✅ Get all posts
✅ Get post by ID
✅ Update post
✅ Delete post
✅ Get user's posts
✅ Frontend running status

### **Cách 2: Test Thủ Công**

#### A. Test Backend API (không cần frontend)

```powershell
# 1. Health check
curl http://localhost:4000/health

# 2. Register user
curl -Method POST -Uri http://localhost:4000/api/auth/register -ContentType "application/json" -Body '{"email":"test@example.com","username":"testuser","password":"123456","fullName":"Test User"}'

# 3. Login (lấy token)
$response = curl -Method POST -Uri http://localhost:4000/api/auth/login -ContentType "application/json" -Body '{"emailOrUsername":"testuser","password":"123456"}'
$token = ($response.Content | ConvertFrom-Json).data.token

# 4. Tạo post (với token)
curl -Method POST -Uri http://localhost:4000/api/posts -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"} -Body '{"content":"My first post!","privacy":"public"}'

# 5. Lấy tất cả posts (không cần token)
curl http://localhost:4000/api/posts
```

#### B. Test Frontend UI

1. Mở browser: http://localhost:3000
2. Kiểm tra Chrome DevTools Console (F12)
3. Xem Network tab để theo dõi API calls

**Các API calls frontend sẽ gọi:**

- `GET /api/posts` - Load posts khi vào trang home
- `POST /api/posts` - Tạo post mới (cần login)
- `PUT /api/posts/{id}` - Edit post (cần login)
- `DELETE /api/posts/{id}` - Xóa post (cần login)

---

## 📊 Kết Quả Test

**Backend API:** ✅ Hoạt động bình thường

```
✅ POST /api/auth/register - 201 Created
✅ POST /api/auth/login - 200 OK
✅ GET  /api/posts - 200 OK
✅ POST /api/posts - 201 Created (authenticated)
✅ GET  /api/posts/{id} - 200 OK
✅ PUT  /api/posts/{id} - 200 OK (authenticated)
✅ DELETE /api/posts/{id} - 204 No Content (authenticated)
✅ GET /api/posts/user/{userId} - 200 OK
```

**Frontend:** ✅ Build thành công, đang chạy port 3000

**Authentication:** ✅ Token được auto-add vào requests

---

## 🔍 Các Lỗi Thường Gặp & Cách Fix

### 1. **API calls bị 404 Not Found**

**Nguyên nhân:** Frontend gọi sai endpoint
**Đã fix:** Update postService.js để dùng `/api/posts` thay vì `/posts`

### 2. **401 Unauthorized khi create/update/delete post**

**Nguyên nhân:** Không có token hoặc token sai
**Đã fix:**

- Tạo authService để quản lý token
- Update axios interceptor để auto-add token
- Token được lưu trong localStorage sau khi login

### 3. **CORS errors**

**Status:** Không có vấn đề! Backend đã enable CORS:

```typescript
app.use(cors()); // Allow all origins
```

---

## 🚀 Chạy Project

```powershell
# Start tất cả services
docker-compose up -d

# Rebuild sau khi code changes
docker-compose up -d --build

# Stop tất cả
docker-compose down

# Xem logs
docker logs backend -f
docker logs frontend -f
```

**URLs:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Backend Health: http://localhost:4000/health
- Database: PostgreSQL port 5432

---

## 📝 API Documentation

### **Authentication Endpoints**

| Method | Endpoint             | Body                                     | Headers                         | Response        |
| ------ | -------------------- | ---------------------------------------- | ------------------------------- | --------------- |
| POST   | `/api/auth/register` | `{email, username, password, fullName?}` | -                               | `{user, token}` |
| POST   | `/api/auth/login`    | `{emailOrUsername, password}`            | -                               | `{user, token}` |
| GET    | `/api/auth/me`       | -                                        | `Authorization: Bearer {token}` | `{user}`        |
| POST   | `/api/auth/logout`   | -                                        | `Authorization: Bearer {token}` | -               |

### **Post Endpoints**

| Method | Endpoint                   | Body                               | Headers                         | Response         |
| ------ | -------------------------- | ---------------------------------- | ------------------------------- | ---------------- |
| GET    | `/api/posts`               | -                                  | -                               | `[posts]`        |
| GET    | `/api/posts/{id}`          | -                                  | -                               | `{post}`         |
| GET    | `/api/posts/user/{userId}` | -                                  | -                               | `[posts]`        |
| POST   | `/api/posts`               | `{content, privacy, imageUrls?}`   | `Authorization: Bearer {token}` | `{post}`         |
| PUT    | `/api/posts/{id}`          | `{content?, privacy?, imageUrls?}` | `Authorization: Bearer {token}` | `{post}`         |
| DELETE | `/api/posts/{id}`          | -                                  | `Authorization: Bearer {token}` | `204 No Content` |

---

## ✨ Tips

1. **Khi test trên UI:**
   - Mở DevTools Console để xem logs
   - Check Network tab để debug API calls
   - Token tự động được add vào requests sau khi login

2. **Khi gặp lỗi:**
   - Check backend logs: `docker logs backend`
   - Check frontend logs: `docker logs frontend`
   - Run test script để verify APIs: `.\test-api.ps1`

3. **Khi thay đổi code:**
   - Backend: Rebuild container: `docker-compose up -d --build server`
   - Frontend: Rebuild container: `docker-compose up -d --build client`
   - Cả hai: `docker-compose up -d --build`

---

## 🎉 Kết Luận

**Tất cả API endpoints đã hoạt động bình thường!**

✅ Frontend đã kết nối đúng với Backend  
✅ Authentication flow hoạt động  
✅ CRUD operations cho Posts hoàn chỉnh  
✅ Token management tự động  
✅ Error handling đầy đủ

**Sẵn sàng để develop thêm features! 🚀**
