# Quick verification script for Java and Maven

Write-Host "Checking Java and Maven Installation" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check Java
Write-Host "Checking Java..." -ForegroundColor Yellow
try {
    $javaOutput = java -version 2>&1
    $javaVersion = $javaOutput | Select-Object -First 1
    Write-Host "OK: Java is installed" -ForegroundColor Green
    Write-Host "   $javaVersion" -ForegroundColor Gray
    
    # Check if it's Java 17+
    if ($javaVersion -match "version ""(1[7-9]|[2-9][0-9])") {
        Write-Host "OK: Java version is 17 or higher" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Java version might be too old (need 17+)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Java not found in PATH" -ForegroundColor Red
    Write-Host "   Please install Java 17+ and add it to PATH" -ForegroundColor Yellow
}

Write-Host ""

# Check Maven
Write-Host "Checking Maven..." -ForegroundColor Yellow
try {
    $mvnOutput = mvn -version 2>&1
    $mvnVersion = $mvnOutput | Select-Object -First 1
    Write-Host "OK: Maven is installed" -ForegroundColor Green
    Write-Host "   $mvnVersion" -ForegroundColor Gray
} catch {
    Write-Host "ERROR: Maven not found in PATH" -ForegroundColor Red
    Write-Host "   Please install Maven and add it to PATH" -ForegroundColor Yellow
}

Write-Host ""

# Check JAVA_HOME
Write-Host "Checking JAVA_HOME..." -ForegroundColor Yellow
if ($env:JAVA_HOME) {
    Write-Host "OK: JAVA_HOME is set" -ForegroundColor Green
    Write-Host "   $env:JAVA_HOME" -ForegroundColor Gray
} else {
    Write-Host "INFO: JAVA_HOME not set (optional but recommended)" -ForegroundColor Yellow
}

Write-Host ""

# Check MAVEN_HOME
Write-Host "Checking MAVEN_HOME..." -ForegroundColor Yellow
if ($env:MAVEN_HOME) {
    Write-Host "OK: MAVEN_HOME is set" -ForegroundColor Green
    Write-Host "   $env:MAVEN_HOME" -ForegroundColor Gray
} else {
    Write-Host "INFO: MAVEN_HOME not set (optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Summary
$javaOk = $false
$mvnOk = $false

try {
    $null = java -version 2>&1
    $javaOk = $true
} catch {
    $javaOk = $false
}

try {
    $null = mvn -version 2>&1
    $mvnOk = $true
} catch {
    $mvnOk = $false
}

if ($javaOk -and $mvnOk) {
    Write-Host "SUCCESS: Both Java and Maven are ready!" -ForegroundColor Green
    Write-Host "You can now run: .\setup.ps1" -ForegroundColor Cyan
} else {
    Write-Host "ACTION REQUIRED: Please install missing components" -ForegroundColor Red
    Write-Host "See INSTALL_JAVA_MAVEN.md for installation instructions" -ForegroundColor Yellow
}


