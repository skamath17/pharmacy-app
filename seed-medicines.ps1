# Seed Medicines Script
# This script seeds the database with sample medicine data

Write-Host "Seeding Medicine Catalog Data"
Write-Host "=============================="
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
        Write-Host ""
        Write-Host "Please either:" -ForegroundColor Yellow
        Write-Host "  1. Install PostgreSQL client tools and add to PATH" -ForegroundColor Yellow
        Write-Host "  2. Install Docker Desktop" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or run the seed script manually using Docker:" -ForegroundColor Yellow
        Write-Host "  docker exec -i pharmacy-postgres psql -U $DB_USER -d $DB_NAME < database/seed_medicines.sql" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "Connecting to database..."
Write-Host "Host: $DB_HOST"
Write-Host "Port: $DB_PORT"
Write-Host "Database: $DB_NAME"
Write-Host ""

try {
    # Run the seed script
    Write-Host "Running seed script..."
    $seedScript = Join-Path $PSScriptRoot "database\seed_medicines.sql"
    
    if (-not (Test-Path $seedScript)) {
        Write-Host "ERROR: Seed script not found at: $seedScript" -ForegroundColor Red
        exit 1
    }
    
    if ($useDocker) {
        # Check if postgres container is running
        $isRunning = docker ps --filter "name=pharmacy-postgres" --format "{{.Names}}" 2>&1
        if ($LASTEXITCODE -ne 0 -or -not $isRunning -or $isRunning -ne "pharmacy-postgres") {
            Write-Host "ERROR: PostgreSQL container 'pharmacy-postgres' is not running." -ForegroundColor Red
            Write-Host "Please start it with: docker-compose up -d postgres" -ForegroundColor Yellow
            exit 1
        }
        
        # Use Docker to execute psql
        Write-Host "Executing SQL script via Docker container..." -ForegroundColor Cyan
        Get-Content $seedScript | docker exec -i pharmacy-postgres psql -U $DB_USER -d $DB_NAME 2>&1
        $exitCode = $LASTEXITCODE
    } else {
        # Use local psql
        $env:PGPASSWORD = $DB_PASSWORD
        $result = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $seedScript 2>&1
        $exitCode = $LASTEXITCODE
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS: Medicine catalog seeded successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "The database now contains:" -ForegroundColor Cyan
        Write-Host "  - 25 different medicines" -ForegroundColor Cyan
        Write-Host "  - Multiple inventory batches per medicine" -ForegroundColor Cyan
        Write-Host "  - Various forms (Tablets, Capsules, Syrups, Creams, Drops)" -ForegroundColor Cyan
        Write-Host "  - Different schedules (H, H1, X, NONE)" -ForegroundColor Cyan
        Write-Host "  - Prescription and OTC medicines" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ERROR: Failed to seed database" -ForegroundColor Red
        if (-not $useDocker) {
            Write-Host $result
        }
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Exception occurred while seeding database" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""
Write-Host "You can now test the catalog API:" -ForegroundColor Yellow
Write-Host "  GET http://localhost:8084/api/catalog/medicines" -ForegroundColor Yellow
Write-Host ""

