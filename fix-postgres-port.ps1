# Quick fix for PostgreSQL port conflict

Write-Host "Fixing PostgreSQL Port Conflict" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Option 1: Try to stop PostgreSQL Windows service
Write-Host "Attempting to stop PostgreSQL Windows service..." -ForegroundColor Yellow
$postgresServices = Get-Service | Where-Object {$_.Name -like "*postgresql*" -or $_.DisplayName -like "*PostgreSQL*"}
if ($postgresServices) {
    foreach ($service in $postgresServices) {
        try {
            Stop-Service -Name $service.Name -Force
            Write-Host "Stopped: $($service.Name)" -ForegroundColor Green
        } catch {
            Write-Host "Could not stop: $($service.Name)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "No PostgreSQL Windows service found" -ForegroundColor Yellow
}

# Option 2: Kill process on port 5432
Write-Host ""
Write-Host "Checking processes on port 5432..." -ForegroundColor Yellow
$processes = netstat -ano | findstr :5432 | ForEach-Object {
    if ($_ -match '\s+(\d+)\s*$') {
        $matches[1]
    }
} | Select-Object -Unique

if ($processes) {
    foreach ($pid in $processes) {
        try {
            $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "Found process: $($proc.ProcessName) (PID: $pid)" -ForegroundColor Yellow
                Write-Host "Do you want to stop it? (Y/N)" -ForegroundColor Cyan
                $response = Read-Host
                if ($response -eq 'Y' -or $response -eq 'y') {
                    Stop-Process -Id $pid -Force
                    Write-Host "Stopped process $pid" -ForegroundColor Green
                }
            }
        } catch {
            Write-Host "Could not access process $pid" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "No processes found on port 5432" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done! You can now run: docker-compose up -d postgres redis" -ForegroundColor Green


