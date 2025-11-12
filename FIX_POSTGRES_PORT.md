# Fix PostgreSQL Port Conflict

## Issue
Port 5432 is already in use by another PostgreSQL instance (PID: 15628)

## Solutions

### Option 1: Stop Existing PostgreSQL Service (Recommended)

```powershell
# Check what's running on port 5432
netstat -ano | findstr :5432

# Stop the PostgreSQL Windows service
Stop-Service -Name "postgresql*" -Force

# Or if it's a different service, find and stop it:
Get-Process -Id 15628 | Stop-Process -Force
```

### Option 2: Use Different Port for Docker PostgreSQL

Change the Docker Compose file to use port 5433 instead:

```yaml
ports:
  - "5433:5432"  # Host:Container
```

Then update `backend/auth-service/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/pharmacy_db
```

### Option 3: Use Existing PostgreSQL Instance

If you want to use your existing PostgreSQL:

1. Create database and user:
```sql
CREATE DATABASE pharmacy_db;
CREATE USER pharmacy_user WITH PASSWORD 'pharmacy_pass';
GRANT ALL PRIVILEGES ON DATABASE pharmacy_db TO pharmacy_user;
```

2. Update `backend/auth-service/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pharmacy_db
spring.datasource.username=pharmacy_user
spring.datasource.password=pharmacy_pass
```

3. Remove PostgreSQL from docker-compose.yml or comment it out

## Quick Fix Script

Run this to stop the existing PostgreSQL service:

```powershell
# Stop PostgreSQL Windows service
$services = Get-Service | Where-Object {$_.Name -like "*postgresql*"}
foreach ($service in $services) {
    Stop-Service -Name $service.Name -Force
    Write-Host "Stopped: $($service.Name)" -ForegroundColor Green
}

# Or kill the process directly
Stop-Process -Id 15628 -Force -ErrorAction SilentlyContinue
```

Then restart Docker containers:
```powershell
docker-compose down
docker-compose up -d postgres redis
```


