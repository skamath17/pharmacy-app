# PowerShell script to test backend API

Write-Host "Testing Auth Service API" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8081/api/auth"

# Test 1: Registration
Write-Host "1. Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "test123"
    firstName = "Test"
    lastName = "User"
    phone = "+919876543210"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "SUCCESS: Registration successful!" -ForegroundColor Green
    Write-Host "  User ID: $($registerResponse.data.user.id)" -ForegroundColor Gray
    Write-Host "  Email: $($registerResponse.data.user.email)" -ForegroundColor Gray
    Write-Host "  Role: $($registerResponse.data.user.role)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "ERROR: Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 2: Login
Write-Host "2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "SUCCESS: Login successful!" -ForegroundColor Green
    Write-Host "  Token received: $($loginResponse.data.token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # Save token for future tests
    $script:authToken = $loginResponse.data.token
} catch {
    Write-Host "ERROR: Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 3: Invalid credentials
Write-Host "3. Testing Invalid Login..." -ForegroundColor Yellow
$invalidLoginBody = @{
    email = "test@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $invalidLoginBody
    
    Write-Host "ERROR: Should have failed but didn't!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "SUCCESS: Correctly rejected invalid credentials" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "API Tests Complete!" -ForegroundColor Green

