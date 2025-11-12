# Verification Steps for Prescription File Viewing

## Step 1: Verify Backend Service is Running
Check that prescription-service is running on port 8083:
- Look for logs showing "Started PrescriptionServiceApplication"
- Service should be accessible at http://localhost:8083

## Step 2: Verify File Exists
Check if the uploaded file exists:
```powershell
# Check if file exists
Get-ChildItem -Path "backend\prescription-service\uploads\prescriptions" -Recurse | Select-Object Name, FullName
```

## Step 3: Verify Frontend Dev Server
Make sure frontend is running:
- Should be on http://localhost:3000
- **Important**: Restart frontend dev server if you changed vite.config.ts
- Press Ctrl+C and run `npm run dev` again

## Step 4: Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to view prescription
4. Look for request to `/prescription-api/prescriptions/files/...`
5. Check:
   - Request URL
   - Status code
   - Response headers
   - Any error messages

## Step 5: Test Direct Backend Access
Test if backend endpoint works directly:
```powershell
# Replace FILENAME with actual filename
$filename = "812cada6-0f12-435d-b5ee-1d46b2af0dee.pdf"
Invoke-WebRequest -Uri "http://localhost:8083/api/prescriptions/files/$filename" -Method HEAD
```

## Step 6: Test Proxy Path
Test if Vite proxy is working:
```powershell
# This should proxy to backend
Invoke-WebRequest -Uri "http://localhost:3000/prescription-api/prescriptions/files/$filename" -Method HEAD
```

## Expected Behavior

### ✅ Working:
- Browser URL: `http://localhost:3000/prescription-api/prescriptions/files/{filename}`
- Vite proxy forwards to: `http://localhost:8083/api/prescriptions/files/{filename}`
- Backend serves file with correct content-type
- File opens in browser or downloads

### ❌ Common Issues:

1. **Frontend not restarted after vite.config.ts change**
   - Solution: Restart `npm run dev`

2. **Backend not running**
   - Solution: Start prescription-service

3. **File doesn't exist**
   - Solution: Check upload directory

4. **Proxy not matching**
   - Solution: Verify vite.config.ts proxy path matches URL

5. **CORS error**
   - Solution: Check backend CORS config allows localhost:3000

## Quick Test Commands

```powershell
# 1. Check backend is running
netstat -ano | findstr :8083

# 2. Check frontend is running  
netstat -ano | findstr :3000

# 3. List uploaded files
Get-ChildItem "backend\prescription-service\uploads\prescriptions"

# 4. Test backend directly (replace filename)
$filename = "812cada6-0f12-435d-b5ee-1d46b2af0dee.pdf"
Invoke-RestMethod -Uri "http://localhost:8083/api/prescriptions/files/$filename" -Method GET -OutFile "test-download.pdf"
```


