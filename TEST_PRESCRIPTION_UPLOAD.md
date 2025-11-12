# Prescription Upload Feature - Testing Guide

## Prerequisites

Before testing, ensure the following services are running:

1. **Docker Services** (PostgreSQL, Redis, Kafka, etc.)
   ```powershell
   docker-compose up -d
   ```

2. **Backend Services**
   - Auth Service (port 8081)
   - Patient Service (port 8082)
   - Prescription Service (port 8083)
   
   You can start all services using:
   ```powershell
   .\start-backend-services.ps1
   ```
   
   Or start individually:
   ```powershell
   # Terminal 1 - Auth Service
   cd backend\auth-service
   mvn spring-boot:run
   
   # Terminal 2 - Patient Service
   cd backend\patient-service
   mvn spring-boot:run
   
   # Terminal 3 - Prescription Service
   cd backend\prescription-service
   mvn spring-boot:run
   ```

3. **Frontend** (port 3000)
   ```powershell
   cd frontend
   npm run dev
   ```

---

## Testing Steps

### Step 1: Verify Services Are Running

Check that all services are accessible:

```powershell
# Check Auth Service
curl http://localhost:8081/api/auth/health

# Check Patient Service  
curl http://localhost:8082/api/patients/health

# Check Prescription Service
curl http://localhost:8083/api/prescriptions
```

---

### Step 2: Create a Test User Account

1. **Via Frontend UI:**
   - Navigate to `http://localhost:3000/register`
   - Fill in registration form:
     - Email: `test@example.com`
     - Password: `test123`
     - Role: `PATIENT`
   - Click "Register"

2. **Via API (PowerShell):**
   ```powershell
   $body = @{
       email = "test@example.com"
       password = "test123"
       role = "PATIENT"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" `
       -Method POST `
       -ContentType "application/json" `
       -Body $body
   ```

---

### Step 3: Complete Patient Profile

1. **Via Frontend UI:**
   - After registration, you'll be redirected to login
   - Login with your credentials
   - You'll be prompted to complete your profile
   - Fill in patient profile form:
     - First Name: `John`
     - Last Name: `Doe`
     - Date of Birth: `1990-01-01`
     - Gender: `MALE`
     - Address: Fill in address details
     - Emergency Contact: Fill in contact details
   - Click "Create Profile"

2. **Via API:**
   ```powershell
   # First, login to get token
   $loginBody = @{
       email = "test@example.com"
       password = "test123"
   } | ConvertTo-Json

   $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
       -Method POST `
       -ContentType "application/json" `
       -Body $loginBody

   $token = $loginResponse.data.token
   $userId = $loginResponse.data.user.id

   # Create patient profile
   $profileBody = @{
       firstName = "John"
       lastName = "Doe"
       dateOfBirth = "1990-01-01"
       gender = "MALE"
       addressLine1 = "123 Main St"
       city = "Mumbai"
       state = "Maharashtra"
       postalCode = "400001"
       country = "India"
       emergencyContactName = "Jane Doe"
       emergencyContactPhone = "9876543210"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:8082/api/patients" `
       -Method POST `
       -ContentType "application/json" `
       -Headers @{ "Authorization" = "Bearer $token"; "X-User-Id" = $userId } `
       -Body $profileBody
   ```

---

### Step 4: Test Prescription Upload

#### Option A: Via Frontend UI (Recommended)

1. **Navigate to Upload Page:**
   - Go to `http://localhost:3000/patient/dashboard`
   - Click on "Upload Prescription" card
   - Or navigate directly to `http://localhost:3000/patient/prescription/upload`

2. **Upload a Prescription:**
   - Click on the upload area or drag & drop a file
   - Select a test file (JPEG, PNG, or PDF)
     - **Tip:** You can use any image file or PDF for testing
     - Maximum file size: 10MB
   - Click "Upload Prescription"
   - You should see a success message
   - You'll be redirected to the prescriptions list page

3. **View Uploaded Prescriptions:**
   - Navigate to `http://localhost:3000/patient/prescriptions`
   - You should see your uploaded prescription with status "PENDING"
   - Click "View Prescription" to see the uploaded file

4. **Test File Validation:**
   - Try uploading a file larger than 10MB → Should show error
   - Try uploading an unsupported file type (e.g., .txt) → Should show error
   - Try uploading without selecting a file → Should show error

#### Option B: Via API (PowerShell)

```powershell
# Get your auth token (from Step 3)
$token = "YOUR_JWT_TOKEN"
$userId = "YOUR_USER_ID"

# Create a test file (or use an existing one)
$testFile = "C:\path\to\your\prescription.pdf"  # Change this path

# Upload prescription
$formData = @{
    file = Get-Item -Path $testFile
}

Invoke-RestMethod -Uri "http://localhost:8083/api/prescriptions/upload" `
    -Method POST `
    -Headers @{ 
        "Authorization" = "Bearer $token"
        "X-User-Id" = $userId
    } `
    -Form $formData
```

---

### Step 5: Test Prescription List API

```powershell
# Get all prescriptions for the logged-in user
Invoke-RestMethod -Uri "http://localhost:8083/api/prescriptions" `
    -Method GET `
    -Headers @{ 
        "Authorization" = "Bearer $token"
        "X-User-Id" = $userId
    }
```

**Expected Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "id": "uuid-here",
      "patientId": "uuid-here",
      "prescriptionType": "UPLOADED",
      "fileUrl": "http://localhost:8083/api/prescriptions/files/filename.pdf",
      "fileType": "application/pdf",
      "status": "PENDING",
      "expiresAt": "2025-05-10T18:47:00",
      "createdAt": "2024-11-10T18:47:00",
      "updatedAt": "2024-11-10T18:47:00"
    }
  ],
  "error": null
}
```

---

### Step 6: Test Get Single Prescription

```powershell
# Replace PRESCRIPTION_ID with actual ID from Step 5
$prescriptionId = "PRESCRIPTION_ID_HERE"

Invoke-RestMethod -Uri "http://localhost:8083/api/prescriptions/$prescriptionId" `
    -Method GET `
    -Headers @{ 
        "Authorization" = "Bearer $token"
        "X-User-Id" = $userId
    }
```

---

### Step 7: Test File Download/View

1. **Via Browser:**
   - Go to the prescriptions list page
   - Click "View Prescription" on any uploaded prescription
   - The file should open in a new tab/window

2. **Via API:**
   ```powershell
   # Get file URL from prescription response, then:
   $fileUrl = "http://localhost:8083/api/prescriptions/files/filename.pdf"
   
   # Download file
   Invoke-WebRequest -Uri $fileUrl -OutFile "downloaded-prescription.pdf"
   ```

---

### Step 8: Test Delete Prescription

```powershell
# Delete a prescription
Invoke-RestMethod -Uri "http://localhost:8083/api/prescriptions/$prescriptionId" `
    -Method DELETE `
    -Headers @{ 
        "Authorization" = "Bearer $token"
        "X-User-Id" = $userId
    }
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Prescription deleted successfully",
  "data": null,
  "error": null
}
```

---

## Test Scenarios Checklist

### ✅ Happy Path
- [ ] User can upload a valid prescription file (JPEG)
- [ ] User can upload a valid prescription file (PNG)
- [ ] User can upload a valid prescription file (PDF)
- [ ] Uploaded prescription appears in the list
- [ ] User can view uploaded prescription file
- [ ] User can delete uploaded prescription
- [ ] Prescription status is set to "PENDING" by default
- [ ] Prescription expiry is set to 6 months from upload date

### ✅ Error Handling
- [ ] Upload fails with file larger than 10MB
- [ ] Upload fails with unsupported file type
- [ ] Upload fails with empty file
- [ ] Upload fails without authentication token
- [ ] Upload fails with invalid user ID
- [ ] Cannot view prescription of another user
- [ ] Cannot delete prescription of another user

### ✅ File Storage
- [ ] Files are stored in `./uploads/prescriptions` directory
- [ ] Files are accessible via the file URL endpoint
- [ ] File names are unique (UUID-based)
- [ ] Deleted prescriptions also delete associated files

### ✅ UI/UX
- [ ] Upload page shows file selection area
- [ ] Selected file name and size are displayed
- [ ] Upload progress/loading state is shown
- [ ] Success message appears after upload
- [ ] Error messages are clear and helpful
- [ ] Prescription list shows all uploaded prescriptions
- [ ] Status badges are color-coded correctly
- [ ] Dates are formatted correctly

---

## Troubleshooting

### Issue: "Failed to upload prescription"
**Solution:**
- Check that prescription-service is running on port 8083
- Verify the `uploads/prescriptions` directory exists and is writable
- Check backend logs for detailed error messages

### Issue: "File not found" when viewing prescription
**Solution:**
- Verify file was uploaded successfully
- Check that file exists in `backend/prescription-service/uploads/prescriptions/`
- Ensure file URL in database matches actual file location

### Issue: "Access denied" errors
**Solution:**
- Ensure you're logged in and have a valid JWT token
- Verify `X-User-Id` header matches the logged-in user
- Check that patient profile exists

### Issue: CORS errors
**Solution:**
- Verify CORS is configured in `SecurityConfig.java`
- Check that frontend is running on `http://localhost:3000`
- Ensure proxy configuration in `vite.config.ts` is correct

---

## Quick Test Script

Save this as `test-prescription-upload.ps1`:

```powershell
# Test Prescription Upload Feature
Write-Host "Testing Prescription Upload Feature" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Step 1: Register user
Write-Host "`n1. Registering test user..." -ForegroundColor Yellow
$registerBody = @{
    email = "prescription-test@example.com"
    password = "test123"
    role = "PATIENT"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    Write-Host "✓ User registered successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Registration failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Login
Write-Host "`n2. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "prescription-test@example.com"
    password = "test123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    $token = $loginResponse.data.token
    $userId = $loginResponse.data.user.id
    Write-Host "✓ Login successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Create patient profile
Write-Host "`n3. Creating patient profile..." -ForegroundColor Yellow
$profileBody = @{
    firstName = "Test"
    lastName = "User"
    city = "Mumbai"
    state = "Maharashtra"
} | ConvertTo-Json

try {
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/patients" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $token"; "X-User-Id" = $userId } `
        -Body $profileBody
    Write-Host "✓ Patient profile created" -ForegroundColor Green
} catch {
    Write-Host "✗ Profile creation failed: $_" -ForegroundColor Red
}

# Step 4: List prescriptions (should be empty initially)
Write-Host "`n4. Listing prescriptions..." -ForegroundColor Yellow
try {
    $prescriptions = Invoke-RestMethod -Uri "http://localhost:8083/api/prescriptions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token"; "X-User-Id" = $userId }
    Write-Host "✓ Found $($prescriptions.data.Count) prescriptions" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to list prescriptions: $_" -ForegroundColor Red
}

Write-Host "`n✓ All API tests completed!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000/patient/prescription/upload" -ForegroundColor White
Write-Host "2. Upload a test prescription file" -ForegroundColor White
Write-Host "3. View it at http://localhost:3000/patient/prescriptions" -ForegroundColor White
```

Run it with:
```powershell
.\test-prescription-upload.ps1
```

---

## Expected File Structure

After uploading, you should see:
```
backend/prescription-service/
└── uploads/
    └── prescriptions/
        └── <uuid>.pdf  (or .jpg, .png)
```

---

## Database Verification

Check uploaded prescriptions in database:
```powershell
docker exec -i pharmacy-postgres psql -U pharmacy_user -d pharmacy_db -c "SELECT id, patient_id, prescription_type, status, file_url, created_at FROM prescriptions ORDER BY created_at DESC LIMIT 5;"
```

---

**Happy Testing! 🧪**

