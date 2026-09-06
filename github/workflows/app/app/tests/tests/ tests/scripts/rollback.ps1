# ================================================================
# HealthConnect - Automatic Rollback Script
# CYB204 Software Security / DevSecOps
# Scenario 3 - Blue-Green Deployment
#
# PURPOSE:
# This script is automatically executed when the pipeline detects
# a deployment or testing failure.
#
# ROLLBACK PROCESS:
# 1. Confirm that the stable BLUE environment is running
# 2. Restore BLUE if it has stopped
# 3. Stop the failed GREEN candidate environment
# 4. Verify BLUE through its health-check endpoint
#
# This ensures that a failed release does not replace the last
# known-good production environment.
# ================================================================

Write-Host "============================================"
Write-Host " HealthConnect Automatic Rollback"
Write-Host "============================================"

# ============================================================
# STEP 1 - CHECK THE STABLE BLUE ENVIRONMENT
# ============================================================
Write-Host "`n[1/3] Checking BLUE environment..."

$blueRunning = docker ps --filter "name=healthconnect-blue" --filter "status=running" --format "{{.Names}}"

if ($blueRunning -ne "healthconnect-blue") {
    Write-Host "BLUE is not currently running."
    Write-Host "Attempting to restore BLUE..."
    $blueExists = docker ps -a --filter "name=healthconnect-blue" --format "{{.Names}}"
    if ($blueExists -eq "healthconnect-blue") {
        docker start healthconnect-blue
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ROLLBACK FAILED"
            Write-Host "BLUE container exists but could not be started."
            exit 1
        }
    } else {
        Write-Host "ROLLBACK FAILED"
        Write-Host "No BLUE container is available to restore."
        exit 1
    }
} else {
    Write-Host "BLUE is already running."
}

# ============================================================
# STEP 2 - REMOVE FAILED GREEN FROM SERVICE
# ============================================================
Write-Host "`n[2/3] Removing failed GREEN environment..."

$greenExists = docker ps -a --filter "name=healthconnect-green" --format "{{.Names}}"
if ($greenExists -eq "healthconnect-green") {
    docker stop healthconnect-green
    docker rm healthconnect-green
    Write-Host "GREEN environment stopped and removed."
} else {
    Write-Host "GREEN container does not exist."
}

# ============================================================
# STEP 3 - VERIFY BLUE AFTER ROLLBACK
# ============================================================
Write-Host "`n[3/3] Verifying BLUE health..."

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 5
    if ($response.status -eq "healthy" -and $response.environment -eq "BLUE") {
        Write-Host "`n============================================"
        Write-Host " ROLLBACK SUCCESSFUL"
        Write-Host " BLUE environment is healthy and available."
        Write-Host "============================================"
        exit 0
    } else {
        Write-Host "`nROLLBACK FAILED"
        Write-Host "BLUE responded but failed health validation."
        Write-Host "Status: $($response.status)"
        Write-Host "Environment: $($response.environment)"
        exit 1
    }
} catch {
    Write-Host "`nROLLBACK FAILED"
    Write-Host "BLUE health endpoint could not be reached."
    Write-Host "Error: $_"
    exit 1
}
