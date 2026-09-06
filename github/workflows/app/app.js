/**
 * HealthConnect Patient Portal
 * CYB204 - Software Security / DevSecOps
 * Scenario 3 - Blue-Green Deployment
 *
 * This Express application represents the HealthConnect patient portal used
 * to demonstrate a secure blue-green deployment workflow.
 *
 * The application exposes:
 * 1. A main portal endpoint
 * 2. A health-check endpoint for automated deployment validation
 * 3. A simulated medical-record endpoint for integration/security testing
 *
 * The deployed environment (BLUE or GREEN) is supplied through an
 * environment variable. This allows the same application image to be
 * used consistently across both deployment environments.
 */

const express = require('express');
const app = express();
const port = 5000;

// ============================================================
// DEPLOYMENT ENVIRONMENT CONFIGURATION
// ============================================================
// DEPLOY_ENV identifies which blue-green environment is running.
//
// BLUE = current/stable production environment
// GREEN = candidate/new release environment
//
// A default value is provided so that the application can still run
// locally if the environment variable has not been configured.

const DEPLOY_ENV = process.env.DEPLOY_ENV || 'unknown';

// ============================================================
// MAIN HEALTHCONNECT PORTAL
// ============================================================
app.get('/', (req, res) => {
    /**
     * Return basic information about the HealthConnect portal.
     * This endpoint also displays the deployment environment so that
     * BLUE and GREEN instances can be clearly distinguished during
     * deployment verification and testing.
     */
    res.json({
        application: 'HealthConnect Patient Portal',
        status: 'running',
        environment: DEPLOY_ENV,
        message: 'Secure access to patient health services'
    });
});

// ============================================================
// AUTOMATED HEALTH-CHECK ENDPOINT
// ============================================================
app.get('/health', (req, res) => {
    /**
     * Provide a lightweight health check for Docker and GitHub Actions.
     * During blue-green deployment, the pipeline can call this endpoint
     * before promoting GREEN to production.
     * HTTP 200 indicates that the application process is running and
     * responding successfully.
     */
    res.json({
        status: 'healthy',
        application: 'HealthConnect',
        environment: DEPLOY_ENV
    });
});

// ============================================================
// SIMULATED PATIENT RECORD ENDPOINT
// ============================================================
app.get('/api/records', (req, res) => {
    /**
     * Represent the medical-record feature introduced in the scenario.
     *
     * IMPORTANT:
     * Real medical information is intentionally NOT stored in this
     * demonstration application. Only fictional data is returned.
     *
     * This endpoint gives us a realistic API that can later be used for
     * automated integration and security testing in the CI/CD pipeline.
     */
    res.json({
        patient_id: 'DEMO-001',
        record_type: 'Demonstration Record',
        classification: 'Confidential',
        environment: DEPLOY_ENV
    });
});

// ============================================================
// SECURITY RESPONSE HEADERS
// ============================================================
app.use((req, res, next) => {
    /**
     * Add baseline HTTP security headers to every application response.
     * These headers demonstrate security-by-design by reducing exposure
     * to common browser-based security risks.
     */

    // Prevent browsers from MIME-sniffing a response into another type
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent the portal from being embedded in an external frame,
    // helping reduce clickjacking risk
    res.setHeader('X-Frame-Options', 'DENY');

    // Restrict where browser content can be loaded from
    res.setHeader('Content-Security-Policy', "default-src 'self'");

    // Reduce unnecessary referrer information sent to other websites
    res.setHeader('Referrer-Policy', 'no-referrer');

    next();
});

// ============================================================
// LOCAL APPLICATION STARTUP
// ============================================================
if (require.main === module) {
    // 0.0.0.0 allows the application to accept connections when it is
    // later executed inside a Docker container.
    app.listen(port, '0.0.0.0', () => {
        console.log(`HealthConnect is running in ${DEPLOY_ENV} environment on port ${port}`);
    });
}

module.exports = app;
