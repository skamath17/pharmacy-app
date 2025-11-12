# Docker Desktop Setup Guide

## Issue: Docker Desktop Not Running

The error message indicates Docker Desktop is not running:
```
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

## Solution

### Step 1: Start Docker Desktop

1. **Open Docker Desktop** from Start Menu or Desktop shortcut
2. **Wait for it to start** - You'll see "Docker Desktop is starting..." in the system tray
3. **Verify it's running** - The Docker icon in system tray should be steady (not animated)

### Step 2: Verify Docker is Running

Run this command to check:
```powershell
docker ps
```

If Docker is running, you should see:
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

If you get an error, Docker Desktop is not fully started yet.

### Step 3: Restart Docker Services

Once Docker Desktop is running, restart the services:
```powershell
docker-compose down
docker-compose up -d
```

### Step 4: Verify Services

Check if containers are running:
```powershell
docker-compose ps
```

You should see:
- pharmacy-postgres
- pharmacy-redis
- pharmacy-zookeeper
- pharmacy-kafka
- pharmacy-elasticsearch

## Alternative: Start Only Required Services

If you only need PostgreSQL for now (to test auth service), you can start just that:

```powershell
docker-compose up -d postgres redis
```

This will start only PostgreSQL and Redis, skipping Kafka and Elasticsearch for now.

## Troubleshooting

### Docker Desktop Won't Start
- Make sure virtualization is enabled in BIOS
- Check Windows Features: Enable "Virtual Machine Platform" and "Windows Subsystem for Linux"
- Restart your computer
- Try running Docker Desktop as Administrator

### Still Having Issues?
You can also run PostgreSQL locally without Docker:
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Create database: `pharmacy_db`
3. Create user: `pharmacy_user` with password: `pharmacy_pass`
4. Update `backend/auth-service/src/main/resources/application.properties` with your connection details


