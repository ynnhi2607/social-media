# Test Upload API với Cloudinary

Write-Host "=== TEST IMAGE UPLOAD API ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"

# 1. Health Check
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Login để lấy token
Write-Host "2. Login to get token..." -ForegroundColor Yellow
try {
    $loginBody = @{
        emailOrUsername = "testuser"
        password = "123456"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    Write-Host "   Trying to register first..." -ForegroundColor Yellow
    
    try {
        $registerBody = @{
            email = "testuser@example.com"
            username = "testuser"
            password = "123456"
            fullName = "Test User"
        } | ConvertTo-Json

        $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
        $token = $registerResponse.token
        Write-Host "✅ Registration successful" -ForegroundColor Green
    } catch {
        Write-Host "❌ Registration also failed: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# 3. Test Upload Single Image (cần file mẫu)
Write-Host "3. Test Upload Single Image..." -ForegroundColor Yellow
Write-Host "   Note: Cần file ảnh thật để test upload" -ForegroundColor Gray
Write-Host "   Endpoint: POST /api/upload/single" -ForegroundColor Gray
Write-Host "   Headers: Authorization: Bearer <token>" -ForegroundColor Gray
Write-Host "   Body: FormData với key 'image' (file)" -ForegroundColor Gray

Write-Host ""

# 4. Test Get All Posts (để verify sau khi upload)
Write-Host "4. Get All Posts..." -ForegroundColor Yellow
try {
    $posts = Invoke-RestMethod -Uri "$baseUrl/api/posts" -Method GET
    Write-Host "✅ Got $($posts.Count) posts" -ForegroundColor Green
    if ($posts.Count -gt 0) {
        Write-Host "   Latest post: $($posts[0].content.Substring(0, [Math]::Min(50, $posts[0].content.Length)))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to get posts: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "✅ Backend is running" -ForegroundColor Green
Write-Host "✅ Authentication works" -ForegroundColor Green
Write-Host "✅ Token: Available" -ForegroundColor Green
Write-Host ""
Write-Host "📸 To test upload:" -ForegroundColor Yellow
Write-Host "   1. Open frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   2. Click Quick Demo Login" -ForegroundColor White
Write-Host "   3. Click + button to create post" -ForegroundColor White
Write-Host "   4. Click 'Upload from Device'" -ForegroundColor White
Write-Host "   5. Select image file" -ForegroundColor White
Write-Host "   6. Wait for upload to Cloudinary" -ForegroundColor White
Write-Host "   7. Create post!" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Or test via curl:" -ForegroundColor Yellow
Write-Host "   curl -X POST http://localhost:4000/api/upload/single ``" -ForegroundColor White
Write-Host "     -H 'Authorization: Bearer $token' ``" -ForegroundColor White
Write-Host "     -F 'image=@path/to/your/image.jpg'" -ForegroundColor White
