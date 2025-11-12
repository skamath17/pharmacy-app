# Add Java to User PATH (no admin required)
# This adds Java to your user PATH instead of system PATH

Write-Host "Adding Java to User PATH..." -ForegroundColor Yellow

$javaPath = "C:\Program Files\Java\jdk-17"
$javaBinPath = "$javaPath\bin"

# Check if Java exists
if (-not (Test-Path "$javaBinPath\java.exe")) {
    Write-Host "ERROR: Java not found at $javaBinPath" -ForegroundColor Red
    exit 1
}

Write-Host "Found Java at: $javaPath" -ForegroundColor Green

# Set JAVA_HOME for current user
Write-Host "Setting JAVA_HOME (User level)..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "User")
Write-Host "OK: JAVA_HOME set to $javaPath" -ForegroundColor Green

# Add to User PATH
Write-Host "Adding Java to user PATH..." -ForegroundColor Yellow
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*$javaBinPath*") {
    if ($currentPath) {
        $newPath = "$currentPath;$javaBinPath"
    } else {
        $newPath = $javaBinPath
    }
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "OK: Added $javaBinPath to User PATH" -ForegroundColor Green
} else {
    Write-Host "INFO: Java already in User PATH" -ForegroundColor Yellow
}

# Refresh PATH for current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$env:JAVA_HOME = $javaPath

Write-Host ""
Write-Host "SUCCESS: Java has been added to User PATH!" -ForegroundColor Green
Write-Host ""
Write-Host "Verifying..." -ForegroundColor Yellow
java -version

Write-Host ""
Write-Host "NOTE: If you want to add to System PATH (for all users)," -ForegroundColor Cyan
Write-Host "run the script as Administrator or use the GUI method." -ForegroundColor Cyan


