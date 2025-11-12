# Testing & Deployment Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ installed (`java -version`)
- ✅ Node.js 18+ installed (`node -v`)
- ✅ Docker Desktop running (`docker ps`)
- ✅ Maven 3.8+ installed (`mvn -v`)
- ✅ PostgreSQL client (optional, for manual DB access)

## Step-by-Step Testing Guide

### 1. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, Kafka, Elasticsearch
docker-compose up -d

# Verify services are running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Check if PostgreSQL is ready (should return "accepting connections")
docker exec pharmacy-postgres pg_isready -U pharmacy_user
```

### 2. Initialize Database

```bash
# Option 1: Using Docker exec
docker exec -i pharmacy-postgres psql -U pharmacy_user -d pharmacy_db < database/schema.sql

# Option 2: Using psql client (if installed locally)
psql -h localhost -U pharmacy_user -d pharmacy_db -f database/schema.sql
# Password: pharmacy_pass

# Option 3: Using Docker Compose
docker-compose exec postgres psql -U pharmacy_user -d pharmacy_db -f /docker-entrypoint-initdb.d/schema.sql
```

**Verify Database:**
```bash
# Connect to database
docker exec -it pharmacy-postgres psql -U pharmacy_user -d pharmacy_db

# List tables
\dt

# Check users table structure
\d users

# Exit
\q
```

### 3. Build and Start Backend

```bash
# Navigate to backend
cd backend

# Build all modules
mvn clean install -DskipTests

# Start auth service
cd auth-service
mvn spring-boot:run

# Or run in background
nohup mvn spring-boot:run > ../logs/auth-service.log 2>&1 &
```

**Verify Backend:**
```bash
# Check if service is running (should return 200 or 404, not connection refused)
curl http://localhost:8081/api/auth/login

# Check health (if actuator is enabled)
curl http://localhost:8081/actuator/health
```

### 4. Setup and Start Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local if needed (default should work)
# VITE_API_BASE_URL=http://localhost:8081/api

# Start development server
npm run dev
```

**Verify Frontend:**
- Open browser: http://localhost:3000
- You should see the home page
- Try navigating to `/login`

### 5. Test Authentication Flow

#### Test Registration (using curl or Postman)

```bash
# Register a new patient
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123",
    "phone": "+919876543210",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "patient@test.com",
      "role": "PATIENT"
    },
    "token": "eyJhbGc..."
  }
}
```

#### Test Login

```bash
# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123"
  }'
```

#### Test via Frontend

1. Open http://localhost:3000/login
2. Enter credentials:
   - Email: `patient@test.com`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to `/patient/dashboard`

### 6. Test Database Operations

```bash
# Connect to database
docker exec -it pharmacy-postgres psql -U pharmacy_user -d pharmacy_db

# Check if user was created
SELECT id, email, role, status FROM users;

# Check patient record (if patient service is implemented)
SELECT * FROM patients;

# Exit
\q
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find process using port 8081
netstat -ano | findstr :8081  # Windows
lsof -i :8081                 # Mac/Linux

# Kill process or change port in application.properties
```

**Database connection error:**
- Verify PostgreSQL is running: `docker-compose ps`
- Check connection string in `application.properties`
- Verify database exists: `docker exec pharmacy-postgres psql -U pharmacy_user -l`

**Build errors:**
```bash
# Clean and rebuild
mvn clean install -U
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Change port in vite.config.ts or kill process
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

**API connection errors:**
- Check `VITE_API_BASE_URL` in `.env.local`
- Verify backend is running on port 8081
- Check CORS settings in backend

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Schema not applied:**
```bash
# Re-run schema
docker exec -i pharmacy-postgres psql -U pharmacy_user -d pharmacy_db < database/schema.sql
```

**Connection refused:**
- Check Docker containers: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Restart: `docker-compose restart postgres`

## Quick Test Scripts

### Test Backend API (test-backend.sh)

```bash
#!/bin/bash
echo "Testing Auth Service..."

# Test registration
echo "1. Testing Registration..."
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }' | jq .

# Test login
echo "2. Testing Login..."
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | jq .
```

### Windows PowerShell Test Script (test-backend.ps1)

```powershell
Write-Host "Testing Auth Service..." -ForegroundColor Green

# Test registration
Write-Host "`n1. Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "test123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $registerBody

# Test login
Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "Login successful! Token received." -ForegroundColor Green
```

## Production Deployment Considerations

### Backend
- Use environment variables for sensitive config
- Enable HTTPS
- Configure proper CORS origins
- Set up proper logging
- Use production database (not Docker)
- Configure JWT secret properly
- Enable security headers

### Frontend
- Build for production: `npm run build`
- Serve via Nginx or similar
- Configure API URL for production
- Enable HTTPS
- Set up proper caching

## Next Steps After Testing

Once everything works:
1. ✅ Verify authentication flow works end-to-end
2. ✅ Test database persistence
3. ✅ Verify frontend-backend communication
4. ✅ Check CORS is working
5. ✅ Test error handling

Then proceed with:
- Building patient service
- Implementing prescription upload
- Creating catalog service
- etc.


