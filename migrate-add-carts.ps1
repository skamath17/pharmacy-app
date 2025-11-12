# Add Cart Tables Migration Script
# This script adds cart tables to the existing database

Write-Host "Adding Cart Tables to Database"
Write-Host "==============================="
Write-Host ""

# Database connection details
$DB_HOST = "localhost"
$DB_PORT = "5433"
$DB_NAME = "pharmacy_db"
$DB_USER = "pharmacy_user"
$DB_PASSWORD = "pharmacy_pass"

# Check if psql is available, otherwise use Docker
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
$useDocker = $false

if (-not $psqlPath) {
    Write-Host "psql not found in PATH. Checking for Docker..." -ForegroundColor Yellow
    
    # Check if Docker is available
    $dockerPath = Get-Command docker -ErrorAction SilentlyContinue
    if ($dockerPath) {
        Write-Host "Using Docker to run psql..." -ForegroundColor Green
        $useDocker = $true
    } else {
        Write-Host "ERROR: Neither psql nor Docker found." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Connecting to database..."
Write-Host "Host: $DB_HOST"
Write-Host "Port: $DB_PORT"
Write-Host "Database: $DB_NAME"
Write-Host ""

try {
    $migrationScript = Join-Path $PSScriptRoot "database\migrate_add_carts.sql"
    
    if (-not (Test-Path $migrationScript)) {
        Write-Host "ERROR: Migration script not found at: $migrationScript" -ForegroundColor Red
        exit 1
    }
    
    if ($useDocker) {
        $isRunning = docker ps --filter "name=pharmacy-postgres" --format "{{.Names}}" 2>&1
        if ($LASTEXITCODE -ne 0 -or -not $isRunning -or $isRunning -ne "pharmacy-postgres") {
            Write-Host "ERROR: PostgreSQL container 'pharmacy-postgres' is not running." -ForegroundColor Red
            Write-Host "Please start it with: docker-compose up -d postgres" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Executing migration script via Docker container..." -ForegroundColor Cyan
        Get-Content $migrationScript | docker exec -i pharmacy-postgres psql -U $DB_USER -d $DB_NAME 2>&1
        $exitCode = $LASTEXITCODE
    } else {
        $env:PGPASSWORD = $DB_PASSWORD
        $result = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $migrationScript 2>&1
        $exitCode = $LASTEXITCODE
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS: Cart tables added successfully!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ERROR: Failed to run migration" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Exception occurred" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""


