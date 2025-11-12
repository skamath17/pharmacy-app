# Installing Java and Maven on Windows

## Option 1: Using Chocolatey (Recommended - Easiest)

If you have Chocolatey package manager installed:

```powershell
# Install Chocolatey first (if not installed)
# Run PowerShell as Administrator and run:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Java 17 (OpenJDK)
choco install openjdk17 -y

# Install Maven
choco install maven -y

# Verify installations
java -version
mvn -version
```

## Option 2: Manual Installation

### Installing Java 17

1. **Download Java 17:**
   - Go to: https://adoptium.net/temurin/releases/?version=17
   - Download: **Windows x64 JDK** (`.msi` installer)
   - Or use: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

2. **Install:**
   - Run the installer
   - Follow the installation wizard
   - **Important:** Check "Add to PATH" during installation

3. **Verify:**
   ```powershell
   java -version
   # Should show: openjdk version "17.x.x" or java version "17.x.x"
   ```

4. **Set JAVA_HOME (if needed):**
   ```powershell
   # Find Java installation path (usually):
   # C:\Program Files\Java\jdk-17
   # or
   # C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
   
   # Set environment variable (run as Administrator):
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "Machine")
   
   # Or set for current session:
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   ```

### Installing Maven

1. **Download Maven:**
   - Go to: https://maven.apache.org/download.cgi
   - Download: **apache-maven-3.9.x-bin.zip** (Binary zip archive)

2. **Extract:**
   - Extract to: `C:\Program Files\Apache\maven`
   - Or any location you prefer (e.g., `C:\tools\apache-maven-3.9.x`)

3. **Set Environment Variables:**
   
   **Option A: Using GUI:**
   - Open "Environment Variables" (Win + R → `sysdm.cpl` → Advanced → Environment Variables)
   - Add to **System Variables**:
     - `MAVEN_HOME` = `C:\Program Files\Apache\maven`
     - Add to `Path`: `%MAVEN_HOME%\bin`

   **Option B: Using PowerShell (as Administrator):**
   ```powershell
   # Set MAVEN_HOME
   [System.Environment]::SetEnvironmentVariable("MAVEN_HOME", "C:\Program Files\Apache\maven", "Machine")
   
   # Add to Path
   $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
   $newPath = "$currentPath;C:\Program Files\Apache\maven\bin"
   [System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
   ```

4. **Verify:**
   ```powershell
   # Close and reopen PowerShell, then:
   mvn -version
   # Should show: Apache Maven 3.9.x
   ```

## Option 3: Using SDKMAN (Windows with WSL/Git Bash)

If you have WSL or Git Bash:

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash

# Install Java 17
sdk install java 17.0.9-tem

# Install Maven
sdk install maven

# Verify
java -version
mvn -version
```

## Quick Verification Script

After installation, run this to verify:

```powershell
Write-Host "Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "Java not found in PATH" -ForegroundColor Red
}

Write-Host "Checking Maven installation..." -ForegroundColor Yellow
try {
    $mvnVersion = mvn -version 2>&1 | Select-Object -First 1
    Write-Host "Maven: $mvnVersion" -ForegroundColor Green
} catch {
    Write-Host "Maven not found in PATH" -ForegroundColor Red
}

Write-Host "Checking JAVA_HOME..." -ForegroundColor Yellow
if ($env:JAVA_HOME) {
    Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green
} else {
    Write-Host "JAVA_HOME not set (optional but recommended)" -ForegroundColor Yellow
}

Write-Host "Checking MAVEN_HOME..." -ForegroundColor Yellow
if ($env:MAVEN_HOME) {
    Write-Host "MAVEN_HOME: $env:MAVEN_HOME" -ForegroundColor Green
} else {
    Write-Host "MAVEN_HOME not set (optional)" -ForegroundColor Yellow
}
```

## Troubleshooting

### Java not found after installation:
1. **Restart PowerShell/Command Prompt** (environment variables need refresh)
2. Check PATH: `$env:Path -split ';' | Select-String -Pattern "java"`
3. Verify installation: Check if `java.exe` exists in installation directory
4. Re-add to PATH manually if needed

### Maven not found after installation:
1. **Restart PowerShell/Command Prompt**
2. Verify `mvn.cmd` exists in `%MAVEN_HOME%\bin`
3. Check PATH includes Maven bin directory
4. Try full path: `C:\Program Files\Apache\maven\bin\mvn.cmd -version`

### Version conflicts:
- If multiple Java versions installed, set `JAVA_HOME` to the one you want
- Use `where.exe java` to see which Java is being used

## Recommended Versions for This Project

- **Java:** 17 or higher (LTS version recommended)
- **Maven:** 3.8.x or higher (3.9.x recommended)

## After Installation

Once both are installed, verify with:

```powershell
java -version
mvn -version
```

Then you can run the setup script:

```powershell
.\setup.ps1
```

