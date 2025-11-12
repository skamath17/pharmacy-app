# Add Java to PATH on Windows
# Run this script as Administrator

Write-Host "Adding Java to PATH..." -ForegroundColor Yellow

$javaPath = "C:\Program Files\Java\jdk-17"
$javaBinPath = "$javaPath\bin"

# Check if Java exists
if (-not (Test-Path "$javaBinPath\java.exe")) {
    Write-Host "ERROR: Java not found at $javaBinPath" -ForegroundColor Red
    exit 1
}

Write-Host "Found Java at: $javaPath" -ForegroundColor Green

# Set JAVA_HOME
Write-Host "Setting JAVA_HOME..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "Machine")
Write-Host "OK: JAVA_HOME set to $javaPath" -ForegroundColor Green

# Add to PATH
Write-Host "Adding Java to system PATH..." -ForegroundColor Yellow
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")

if ($currentPath -notlike "*$javaBinPath*") {
    $newPath = "$currentPath;$javaBinPath"
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "OK: Added $javaBinPath to PATH" -ForegroundColor Green
} else {
    Write-Host "INFO: Java already in PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "SUCCESS: Java has been added to PATH!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Please close and reopen PowerShell/Command Prompt" -ForegroundColor Cyan
Write-Host "for the changes to take effect." -ForegroundColor Cyan
Write-Host ""
Write-Host "After reopening, verify with: java -version" -ForegroundColor Yellow


