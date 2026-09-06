/**
 * HealthConnect Unit Tests
 * CYB204 Software Security / DevSecOps
 * Scenario 3 - Blue-Green Deployment
 *
 * Purpose:
 * These unit tests validate application logic in isolation,
 * using the Express test client before any container is built.
 */

const request = require('supertest');
const app = require('../app/app');

describe('HealthConnect Unit Tests', function() {

    test('Home endpoint returns success and identifies HealthConnect', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.application).toBe('HealthConnect Patient Portal');
                done();
            });
    });

    test('Health endpoint reports healthy', function(done) {
        request(app)
            .get('/health')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.status).toBe('healthy');
                done();
            });
    });

    test('Patient records endpoint returns demo data', function(done) {
        request(app)
            .get('/api/records')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.patient_id).toBe('DEMO-001');
                expect(res.body.classification).toBe('Confidential');
                done();
            });
    });

    test('Unknown route returns 404', function(done) {
        request(app)
            .get('/this-route-does-not-exist')
            .expect(404)
            .end(done);
    });

});
