# PowerShell script for Windows users
# Quick Setup Script for Pharmacy App

Write-Host "Pharmacy App Setup Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

function Test-Command {
    param($Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        Write-Host "OK: $Command is installed" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERROR: $Command is not installed" -ForegroundColor Red
        return $false
    }
}

$allGood = $true
if (-not (Test-Command "java")) { 
    $allGood = $false 
}
if (-not (Test-Command "node")) { 
    $allGood = $false 
}
if (-not (Test-Command "docker")) { 
    $allGood = $false 
}
if (-not (Test-Command "mvn")) { 
    $allGood = $false 
}

if (-not $allGood) {
    Write-Host "Please install missing prerequisites" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting Docker services..." -ForegroundColor Yellow

# Check if Docker is running
try {
    $null = docker ps 2>&1
    Write-Host "OK: Docker is running" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    Write-Host "See DOCKER_SETUP.md for instructions" -ForegroundColor Yellow
    exit 1
}

docker-compose up -d

Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if PostgreSQL is ready
$maxAttempts = 30
$attempt = 0
$postgresReady = $false

while ($attempt -lt $maxAttempts) {
    $attempt++
    $result = docker exec pharmacy-postgres pg_isready -U pharmacy_user 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: PostgreSQL is ready" -ForegroundColor Green
        $postgresReady = $true
        break
    }
    Write-Host "Waiting for PostgreSQL... ($attempt/$maxAttempts)" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}

if (-not $postgresReady) {
    Write-Host "WARNING: PostgreSQL did not become ready in time" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Initializing database..." -ForegroundColor Yellow
try {
    Get-Content database\schema.sql | docker exec -i pharmacy-postgres psql -U pharmacy_user -d pharmacy_db
    Write-Host "OK: Database schema created" -ForegroundColor Green
}
catch {
    Write-Host "WARNING: Database initialization had issues (might already exist)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Building backend..." -ForegroundColor Yellow
Push-Location backend
try {
    mvn clean install -DskipTests -q
    Write-Host "OK: Backend built successfully" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Backend build failed" -ForegroundColor Red
}
Pop-Location

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location frontend
try {
    if (-not (Test-Path ".env.local")) {
        if (Test-Path ".env.example") {
            Copy-Item .env.example .env.local
            Write-Host "OK: Created .env.local file" -ForegroundColor Green
        }
    }
    npm install --silent
    Write-Host "OK: Frontend dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Frontend setup failed" -ForegroundColor Red
}
Pop-Location

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Start backend:  cd backend\auth-service; mvn spring-boot:run"
Write-Host "2. Start frontend: cd frontend; npm run dev"
Write-Host "3. Open browser:   http://localhost:3000"
