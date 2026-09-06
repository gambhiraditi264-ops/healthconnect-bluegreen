/**
 * HealthConnect Security Tests
 * CYB204 Software Security / DevSecOps
 * Scenario 3 - Blue-Green Deployment
 *
 * Purpose:
 * These automated security tests validate HTTP response headers
 * and check for debug information exposure on the running GREEN container.
 */

const request = require('supertest');

const GREEN_URL = 'http://localhost:5001';

describe('HealthConnect GREEN Security Tests', function() {

    test('X-Content-Type-Options header is present', function(done) {
        request(GREEN_URL)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.headers['x-content-type-options']).toBe('nosniff');
                done();
            });
    });

    test('X-Frame-Options header is present', function(done) {
        request(GREEN_URL)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.headers['x-frame-options']).toBe('DENY');
                done();
            });
    });

    test('Content-Security-Policy header is present', function(done) {
        request(GREEN_URL)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.headers['content-security-policy']).toBe("default-src 'self'");
                done();
            });
    });

    test('Referrer-Policy header is present', function(done) {
        request(GREEN_URL)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.headers['referrer-policy']).toBe('no-referrer');
                done();
            });
    });

    test('No debug information is exposed', function(done) {
        request(GREEN_URL)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.text).not.toContain('Traceback');
                expect(res.text).not.toContain('Werkzeug Debugger');
                done();
            });
    });

});
