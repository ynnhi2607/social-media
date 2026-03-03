# Social Media App - Test Script
# Chạy file này để test toàn bộ API endpoints

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🧪 TESTING SOCIAL MEDIA API" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Test Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
try {
    $health = curl -UseBasicParsing http://localhost:4000/health
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    exit 1
}

# 2. Test Register
Write-Host "`n2️⃣  Testing User Registration..." -ForegroundColor Yellow
try {
    $testEmail = "test_$(Get-Random)@example.com"
    $registerBody = @{
        email = $testEmail
        username = "testuser_$(Get-Random -Maximum 9999)"
        password = "123456"
        fullName = "Test User"
    } | ConvertTo-Json

    $registerResponse = curl -UseBasicParsing -Method POST -Uri http://localhost:4000/api/auth/register -ContentType "application/json" -Body $registerBody
    $registerData = $registerResponse.Content | ConvertFrom-Json
    $token = $registerData.data.token
    $userId = $registerData.data.user.id
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "   User: $($registerData.data.user.username)" -ForegroundColor Gray
    Write-Host "   Email: $($registerData.data.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Test Login
Write-Host "`n3️⃣  Testing User Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        emailOrUsername = $testEmail
        password = "123456"
    } | ConvertTo-Json

    $loginResponse = curl -UseBasicParsing -Method POST -Uri http://localhost:4000/api/auth/login -ContentType "application/json" -Body $loginBody
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.data.token
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Test Create Post
Write-Host "`n4️⃣  Testing Create Post..." -ForegroundColor Yellow
try {
    $postBody = @{
        content = "This is a test post created at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        privacy = "public"
    } | ConvertTo-Json

    $createPostResponse = curl -UseBasicParsing -Method POST -Uri http://localhost:4000/api/posts -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"} -Body $postBody
    $createdPost = $createPostResponse.Content | ConvertFrom-Json
    $postId = $createdPost.id
    
    Write-Host "✅ Post created successfully!" -ForegroundColor Green
    Write-Host "   Post ID: $postId" -ForegroundColor Gray
    Write-Host "   Content: $($createdPost.content.Substring(0, 40))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Create post failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test Get All Posts
Write-Host "`n5️⃣  Testing Get All Posts..." -ForegroundColor Yellow
try {
    $postsResponse = curl -UseBasicParsing http://localhost:4000/api/posts
    $posts = $postsResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Retrieved $($posts.Count) posts" -ForegroundColor Green
} catch {
    Write-Host "❌ Get posts failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Test Get Post By ID
Write-Host "`n6️⃣  Testing Get Post By ID..." -ForegroundColor Yellow
try {
    $postResponse = curl -UseBasicParsing "http://localhost:4000/api/posts/$postId"
    $post = $postResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Retrieved post by ID" -ForegroundColor Green
    Write-Host "   Content: $($post.content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get post by ID failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Test Update Post
Write-Host "`n7️⃣  Testing Update Post..." -ForegroundColor Yellow
try {
    $updateBody = @{
        content = "Updated post content at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        privacy = "public"
    } | ConvertTo-Json

    $updateResponse = curl -UseBasicParsing -Method PUT -Uri "http://localhost:4000/api/posts/$postId" -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"} -Body $updateBody
    $updatedPost = $updateResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Post updated successfully!" -ForegroundColor Green
    Write-Host "   New content: $($updatedPost.content.Substring(0, 40))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Update post failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Test Get Posts By User
Write-Host "`n8️⃣  Testing Get Posts By User..." -ForegroundColor Yellow
try {
    $userPostsResponse = curl -UseBasicParsing "http://localhost:4000/api/posts/user/$userId"
    $userPosts = $userPostsResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Retrieved $($userPosts.Count) posts for user" -ForegroundColor Green
} catch {
    Write-Host "❌ Get user posts failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Test Delete Post
Write-Host "`n9️⃣  Testing Delete Post..." -ForegroundColor Yellow
try {
    curl -UseBasicParsing -Method DELETE -Uri "http://localhost:4000/api/posts/$postId" -Headers @{"Authorization"="Bearer $token"} | Out-Null
    
    Write-Host "✅ Post deleted successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Delete post failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 10. Test Frontend
Write-Host "`n🔟 Testing Frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = curl -UseBasicParsing http://localhost:3000
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running!" -ForegroundColor Green
        Write-Host "   URL: http://localhost:3000" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Frontend is not running!" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ ALL TESTS COMPLETED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:4000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Database: PostgreSQL on port 5432" -ForegroundColor White
Write-Host "`n   Open http://localhost:3000 in your browser to test the UI!" -ForegroundColor Yellow
