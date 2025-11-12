# Manual Instructions: Add Java to PATH via Windows GUI

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Manual Method: Add Java to PATH via GUI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1: Open Environment Variables" -ForegroundColor Yellow
Write-Host "  - Press Win + R" -ForegroundColor Gray
Write-Host "  - Type: sysdm.cpl" -ForegroundColor Gray
Write-Host "  - Press Enter" -ForegroundColor Gray
Write-Host "  - Click 'Advanced' tab" -ForegroundColor Gray
Write-Host "  - Click 'Environment Variables' button" -ForegroundColor Gray
Write-Host ""
Write-Host "Step 2: Add JAVA_HOME" -ForegroundColor Yellow
Write-Host "  - Under 'User variables' (or 'System variables' if admin)" -ForegroundColor Gray
Write-Host "  - Click 'New...'" -ForegroundColor Gray
Write-Host "  - Variable name: JAVA_HOME" -ForegroundColor Gray
Write-Host "  - Variable value: C:\Program Files\Java\jdk-17" -ForegroundColor Gray
Write-Host "  - Click OK" -ForegroundColor Gray
Write-Host ""
Write-Host "Step 3: Add Java to PATH" -ForegroundColor Yellow
Write-Host "  - Find 'Path' variable in 'User variables' (or 'System variables')" -ForegroundColor Gray
Write-Host "  - Click 'Edit...'" -ForegroundColor Gray
Write-Host "  - Click 'New'" -ForegroundColor Gray
Write-Host "  - Add: C:\Program Files\Java\jdk-17\bin" -ForegroundColor Gray
Write-Host "  - Click OK on all dialogs" -ForegroundColor Gray
Write-Host ""
Write-Host "Step 4: Restart PowerShell/Command Prompt" -ForegroundColor Yellow
Write-Host "  - Close all PowerShell/CMD windows" -ForegroundColor Gray
Write-Host "  - Open a new PowerShell window" -ForegroundColor Gray
Write-Host "  - Run: java -version" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan


