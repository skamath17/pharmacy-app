# PowerShell script to start all backend services

Write-Host "Starting Backend Services" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{
        Name = "Auth Service"
        Path = "backend\auth-service"
        Port = 8081
    },
    @{
        Name = "Patient Service"
        Path = "backend\patient-service"
        Port = 8082
    },
    @{
        Name = "Prescription Service"
        Path = "backend\prescription-service"
        Port = 8083
    },
    @{
        Name = "Catalog Service"
        Path = "backend\catalog-service"
        Port = 8084
    },
    @{
        Name = "Cart Service"
        Path = "backend\cart-service"
        Port = 8085
    },
    @{
        Name = "Order Service"
        Path = "backend\order-service"
        Port = 8086
    }
)

$jobs = @()

foreach ($service in $services) {
    Write-Host "Starting $($service.Name)..." -ForegroundColor Yellow
    
    Push-Location $service.Path
    
    # Start service in background
    $job = Start-Job -ScriptBlock {
        param($servicePath)
        Set-Location $servicePath
        mvn spring-boot:run 2>&1
    } -ArgumentList (Resolve-Path $service.Path)
    
    $jobs += @{
        Name = $service.Name
        Job = $job
        Port = $service.Port
    }
    
    Pop-Location
    
    Write-Host "Started $($service.Name) (Port: $($service.Port))" -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Services running:" -ForegroundColor Cyan
foreach ($jobInfo in $jobs) {
    Write-Host "  - $($jobInfo.Name): http://localhost:$($jobInfo.Port)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Wait for user interrupt
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if any job failed
        foreach ($jobInfo in $jobs) {
            if ($jobInfo.Job.State -eq 'Failed') {
                Write-Host "ERROR: $($jobInfo.Name) failed!" -ForegroundColor Red
                Receive-Job $jobInfo.Job
            }
        }
    }
} finally {
    Write-Host ""
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    foreach ($jobInfo in $jobs) {
        Stop-Job $jobInfo.Job
        Remove-Job $jobInfo.Job
    }
    Write-Host "All services stopped." -ForegroundColor Green
}

