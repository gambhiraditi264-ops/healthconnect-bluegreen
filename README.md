# HealthConnect Blue-Green Deployment

## CYB204 Secure Applications and DevSecOps

### Scenario 3 - Week 7 Submission

---

## Overview

This repository contains a complete Blue-Green deployment implementation for HealthConnect, a demonstration patient portal application.

### What's Included

- **GitHub Actions Pipeline** (`.github/workflows/deploy-blue-green.yml`)
- **Express Application** (`app/app.js`, `app/package.json`)
- **Automated Tests** (`tests/`):
  - Unit tests
  - Integration tests
  - Security tests
- **Docker Containerisation** (`Dockerfile`)
- **Automatic Rollback Script** (`scripts/rollback.ps1`)

---

## Pipeline Stages

1. Checkout code
2. Verify project files
3. Set up Node.js
4. Run unit tests
5. Build Docker image
6. Deploy BLUE (current stable)
7. Deploy GREEN (candidate release)
8. Run integration tests
9. Run security tests
10. GREEN health check
11. Promote GREEN to production (if all pass)
12. Automatic rollback on failure

---

## Screenshots

All evidence screenshots are in the `evidence/` folder.

---

## Author

Student Name: [ADITI GAMBHIR]
Student ID: [24021168]
Unit: CYB204 Secure Applications and DevSecOps
