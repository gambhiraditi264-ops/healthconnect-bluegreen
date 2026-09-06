/**
 * HealthConnect Integration Tests
 * CYB204 Software Security / DevSecOps
 * Scenario 3 - Blue-Green Deployment
 *
 * Purpose:
 * These integration tests send real HTTP requests to the running
 * GREEN container on port 5001, validating the deployed artefact
 * as a whole (container, networking, application).
 */

const request = require('supertest');

const GREEN_URL = 'http://localhost:5001';

describe('HealthConnect GREEN Integration Tests', function() {

    test('GREEN application is available', function(done) {
        request(GREEN_URL)
            .get('/')
            .expect(200)
            .end(done);
    });

    test('GREEN environment identity is correct', function(done) {
        request(GREEN_URL)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.environment).toBe('GREEN');
                done();
            });
    });

    test('GREEN health check passes', function(done) {
        request(GREEN_URL)
            .get('/health')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.status).toBe('healthy');
                expect(res.body.environment).toBe('GREEN');
                done();
            });
    });

    test('Patient record feature works on GREEN', function(done) {
        request(GREEN_URL)
            .get('/api/records')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.patient_id).toBe('DEMO-001');
                expect(res.body.classification).toBe('Confidential');
                done();
            });
    });

});
