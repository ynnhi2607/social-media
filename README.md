# 🌐 Social Media Application

Full-stack social media platform với React frontend và Node.js backend.

## � Documentation

- 📖 **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment & environment variables
- 📸 **[Cloudinary Setup](./CLOUDINARY_SETUP.md)** - Image upload configuration
- 🔧 **[Fixes Log](./FIXES.md)** - Bug fixes history

## �📋 Tech Stack

### Frontend

- React 18
- Vite
- TailwindCSS
- Axios
- React Router

### Backend

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Docker

## 🚀 Cách Chạy Project

### **Yêu cầu:**

- Docker Desktop
- Node.js 20+ (nếu chạy dev mode)
- Git

---

## ⚡ Quick Start (Production Mode)

### 1. Clone project

```bash
git clone <repository-url>
cd social-media
```

### 2. Setup Environment Variables

**Backend** - Tạo file `server/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/social_media
JWT_SECRET=your-secret-key-here-change-this-in-production
NODE_ENV=development

# Cloudinary (for image uploads) - Get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

> 📸 **Image Upload:** Cần setup Cloudinary để upload ảnh. Xem chi tiết: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

**Frontend** - Tạo file `client/.env`:

```env
VITE_API_URL=http://localhost:4000
```

### 3. Chạy với Docker

```bash
docker-compose up -d --build
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Backend Health Check**: http://localhost:4000/health

### 5. Login

Click vào **Quick Login widget** (góc phải trên) và chọn:

- **Quick Demo Login** (1 click)
- Hoặc login thủ công: `testuser` / `123456`
- Hoặc đăng ký account mới

**🎉 Done! Bắt đầu sử dụng!**

---

## 🔧 Development Mode (Hot Reload)

### Backend (Docker)

```bash
# Backend vẫn chạy Docker
docker-compose up -d backend db
```

### Frontend (Local - Auto Reload)

```bash
# Stop Docker frontend
docker stop frontend

# Chạy dev mode
cd client
npm install
npm run dev
```

→ Frontend dev server: http://localhost:4028 (auto reload khi code thay đổi)

→ Backend API: http://localhost:4000 (Docker)

---

## 📦 Các Commands Hữu Ích

### Docker Commands

```bash
# Start tất cả services
docker-compose up -d

# Rebuild sau khi thay đổi code
docker-compose up -d --build

# Rebuild chỉ frontend
docker-compose up -d --build client

# Rebuild chỉ backend
docker-compose up -d --build server

# Stop tất cả
docker-compose down

# Xem logs
docker logs backend -f
docker logs frontend -f

# Restart service
docker-compose restart backend
docker-compose restart frontend
```

### Backend Commands (trong container)

```bash
# Vào bash của backend container
docker exec -it backend sh

# Chạy migration
docker exec backend npx prisma migrate dev

# Xem migration status
docker exec backend npx prisma migrate status

# Generate Prisma Client
docker exec backend npx prisma generate

# Reset database (⚠️ Xóa hết data)
docker exec backend npx prisma migrate reset
```

### Local Development Commands

```bash
# Frontend
cd client
npm install          # Cài dependencies
npm run dev          # Dev server với hot reload
npm run build        # Build production
npm run preview      # Preview production build

# Backend
cd server
npm install          # Cài dependencies
npm run dev          # Dev server với auto-restart
npm run build        # Build TypeScript
npm start            # Chạy production
npm run migrate      # Run database migrations
```

---

## 🧪 Test API

### Sử dụng Test Script

```powershell
# Chạy từ root folder
.\test-api.ps1
```

Script sẽ test:

- ✅ Health check
- ✅ User registration
- ✅ User login
- ✅ Create post
- ✅ Get posts
- ✅ Update post
- ✅ Delete post
- ✅ Frontend accessibility

### Test Thủ Công (PowerShell)

```powershell
# Health check
curl http://localhost:4000/health

# Register
curl -Method POST -Uri http://localhost:4000/api/auth/register -ContentType "application/json" -Body '{"email":"test@example.com","username":"testuser","password":"123456","fullName":"Test User"}'

# Login
curl -Method POST -Uri http://localhost:4000/api/auth/login -ContentType "application/json" -Body '{"emailOrUsername":"testuser","password":"123456"}'

# Get all posts
curl http://localhost:4000/api/posts
```

---

## 📁 Cấu Trúc Project

```
social-media/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middlewares/  # Express middlewares
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utilities
│   │   └── types/        # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── migrations/   # Database migrations
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Docker orchestration
├── test-api.ps1          # API test script
├── README.md
├── FIXES.md              # Documented fixes
└── CREATE_POST_FIX.md    # Create post fix details
```

---

## 🔍 Troubleshooting

### 1. Port đã được sử dụng

```bash
# Kiểm tra port đang được dùng
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :5432

# Kill process (thay <PID> bằng process ID)
taskkill /PID <PID> /F
```

### 2. Container không start

```bash
# Xem logs chi tiết
docker logs backend
docker logs frontend
docker logs postgres_db

# Restart Docker Desktop
# Hoặc rebuild không dùng cache
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 3. Database connection failed

```bash
# Kiểm tra PostgreSQL container
docker ps | findstr postgres

# Vào PostgreSQL container
docker exec -it postgres_db psql -U postgres -d social_media

# Check tables
\dt
```

### 4. Frontend gọi sai API URL

- Check browser Console (F12)
- Xem network requests đang gọi đâu
- Đảm bảo `client/.env` có `VITE_API_URL=http://localhost:4000`
- Hard refresh browser: `Ctrl+Shift+R`

### 5. Cannot create post - Unauthorized

- Đảm bảo đã login (có Quick Login widget)
- Check token trong localStorage (F12 → Application → Local Storage)
- Nếu không có token → Login lại

### 6. Hot reload không hoạt động

- Production mode (Docker) không có hot reload
- Dùng dev mode: `cd client && npm run dev`

---

## 🌟 Features

### ✅ Đã implement:

- User registration & authentication (JWT)
- Login/Logout
- Create posts (text + images)
- **📸 Image upload từ device (Cloudinary CDN)**
- Upload multiple images (max 4 per post)
- Auto resize & optimize images
- Image preview và remove
- Support paste image URL (alternative)
- View all posts
- Edit own posts
- Delete own posts
- View posts by user
- Quick login widget
- Infinite scroll pagination

### 🚧 TODO (có thể thêm):

- Like posts
- Comment on posts
- Share posts
- User profiles & avatar upload
- Follow/Unfollow users
- Real-time notifications
- Search functionality
- Dark mode
- Mobile responsive improvements
- Image cropper before upload

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Auth Required | Body                                     | Response        |
| ------ | -------------------- | ------------- | ---------------------------------------- | --------------- |
| POST   | `/api/auth/register` | ❌            | `{email, username, password, fullName?}` | `{user, token}` |
| POST   | `/api/auth/login`    | ❌            | `{emailOrUsername, password}`            | `{user, token}` |
| GET    | `/api/auth/me`       | ✅            | -                                        | `{user}`        |
| POST   | `/api/auth/logout`   | ✅            | -                                        | -               |

### Post Endpoints

| Method | Endpoint                  | Auth Required | Body                               | Response         |
| ------ | ------------------------- | ------------- | ---------------------------------- | ---------------- |
| GET    | `/api/posts`              | ❌            | -                                  | `[posts]`        |
| GET    | `/api/posts/:id`          | ❌            | -                                  | `{post}`         |
| GET    | `/api/posts/user/:userId` | ❌            | -                                  | `[posts]`        |
| POST   | `/api/posts`              | ✅            | `{content, privacy, imageUrls?}`   | `{post}`         |
| PUT    | `/api/posts/:id`          | ✅            | `{content?, privacy?, imageUrls?}` | `{post}`         |
| DELETE | `/api/posts/:id`          | ✅            | -                                  | `204 No Content` |

### Upload Endpoints

| Method | Endpoint               | Auth Required | Body                       | Response                         |
| ------ | ---------------------- | ------------- | -------------------------- | -------------------------------- |
| POST   | `/api/upload/single`   | ✅            | FormData: `image` (file)   | `{url, publicId, width, height}` |
| POST   | `/api/upload/multiple` | ✅            | FormData: `images` (files) | `[{url, publicId, ...}, ...]`    |
| DELETE | `/api/upload/delete`   | ✅            | `{publicId}`               | `{success: true}`                |

**Auth Required** = Cần `Authorization: Bearer <token>` header

---

## 👥 Contributors

- Huynh Yen Nhi
- Nguyen Duy Nhat

## 📄 License

MIT

---

## 💡 Tips

1. **Khi develop frontend**: Dùng `npm run dev` cho hot reload
2. **Khi test production**: Dùng Docker
3. **Khi gặp lỗi**: Check logs bằng `docker logs <container-name>`
4. **Clear cache**: `docker system prune -f` (cẩn thận, xóa unused images)
5. **Debug API**: Mở DevTools → Network tab để xem requests

---
