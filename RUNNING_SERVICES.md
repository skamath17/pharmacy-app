# Running Multiple Backend Services

## Current Setup

The application uses a **microservices architecture**, where each service runs independently:

- **Auth Service** - Port 8081 (Authentication & Authorization)
- **Patient Service** - Port 8082 (Patient Profile Management)
- **Future Services** - Will run on ports 8083, 8084, etc.

## Option 1: Use Start Script (Recommended)

### Windows PowerShell:
```powershell
.\start-backend-services.ps1
```

### Linux/Mac:
```bash
chmod +x start-backend-services.sh
./start-backend-services.sh
```

This script will:
- Start all services in the background
- Show status of each service
- Allow you to stop all services with Ctrl+C

## Option 2: Separate Terminals (Current Method)

### Terminal 1 - Auth Service:
```powershell
cd backend\auth-service
mvn spring-boot:run
```

### Terminal 2 - Patient Service:
```powershell
cd backend\patient-service
mvn spring-boot:run
```

### Terminal 3 - Frontend:
```powershell
cd frontend
npm run dev
```

## Option 3: Use Docker Compose (Future)

For production, we can containerize services and run them with Docker Compose:

```yaml
services:
  auth-service:
    build: ./backend/auth-service
    ports:
      - "8081:8081"
  
  patient-service:
    build: ./backend/patient-service
    ports:
      - "8082:8082"
```

## Option 4: API Gateway (Future Enhancement)

For a production setup, we can add Spring Cloud Gateway to route all requests through a single entry point:

- Single port (e.g., 8080) for all API calls
- Gateway routes to appropriate microservices
- Load balancing and service discovery

## Current Recommendation

For development, use **Option 1** (start script) or **Option 2** (separate terminals) depending on your preference.

The start script is easier but separate terminals give you better visibility into each service's logs.

## Quick Reference

| Service | Port | Purpose |
|---------|------|---------|
| Auth Service | 8081 | Login, Register, JWT |
| Patient Service | 8082 | Patient profiles |
| Frontend | 3000 | React app |


