var assert = require('assert');
var request = require('supertest');

describe('Unit tests for McMasterGame Project', function () {

    function verifyTestFramework(x, y) {
        return x + y;
    }

    //set up server for each test
    var server;
    beforeEach(function () {
        // run server in test mode
        process.env.NODE_ENV = 'test';
        server = require('../server').server;
    });

    // verifying test framework
    it('should verify that test framework works', function () {
        assert.equal(verifyTestFramework(2, 3), 5);
    });

    // =========================== RELEASE 1.0 TESTING ==================================

    //testing / controller
    it('should respond with an html file when root is requested', function (done) {
        request(server)
            .get('/')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    //testing /user/login controller
    it('should respond with an html file when /user/login is requested', function (done) {
        request(server)
            .get('/user/login')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    // testing /user/register controller
    it('should respond with an html file when /user/register is requested', function (done) {
        request(server)
            .get('/user/register')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    // testing /user/logout controller
    it('should respond with an html file when /user/logout is requested', function (done) {
        request(server)
            .get('/user/logout')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/plain; charset=utf-8');
                done();
            });
    });

    // testing error-processing controller
    it('should send 404 when a request is made to any other path', function (done) {
        request(server)
            .get('/dummy/path')
            .expect(404)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    // =========================== RELEASE 1.0 TESTING ENDS ===============================
});
