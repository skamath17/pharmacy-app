# Quick Reference: Testing Commands

## Start Everything
```bash
# Option 1: Use setup script (Linux/Mac)
chmod +x setup.sh start-dev.sh test-backend.sh start-backend-services.sh
./setup.sh
./start-backend-services.sh  # Start all backend services
# In another terminal:
cd frontend && npm run dev

# Option 2: Use PowerShell script (Windows)
.\setup.ps1
.\start-backend-services.ps1  # Start all backend services
# In another terminal:
cd frontend; npm run dev

# Option 3: Manual steps
# Terminal 1: Auth Service
cd backend/auth-service && mvn spring-boot:run

# Terminal 2: Patient Service  
cd backend/patient-service && mvn spring-boot:run

# Terminal 3: Frontend
cd frontend && npm run dev
```

## Test Backend API
```bash
# Linux/Mac
chmod +x test-backend.sh
./test-backend.sh

# Windows PowerShell
.\test-backend.ps1

# Manual curl
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'
```

## Check Services
```bash
# Docker services
docker-compose ps

# Backend health
curl http://localhost:8081/api/auth/login

# Frontend
open http://localhost:3000
```

## Database Access
```bash
# Connect to database
docker exec -it pharmacy-postgres psql -U pharmacy_user -d pharmacy_db

# List tables
\dt

# Check users
SELECT * FROM users;

# Exit
\q
```

## Troubleshooting
```bash
# View logs
docker-compose logs postgres
docker-compose logs redis

# Restart services
docker-compose restart

# Clean restart
docker-compose down
docker-compose up -d
```

