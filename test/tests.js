/*
 *     Purpose: Unit testing file for site controllers
 *     Authors: McMaster Team
 *     Date: 2017-04-16
 *     Version: 1.0
 */

// import required for testing packages
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

    // =========================== RELEASE 1.2 TESTING ==================================

    //testing / controller
    it('should respond with an html file when root is requested', function (done) {
        console.log("\nRELEASE 1.2 TESTING STARTS\n");
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

    // =========================== RELEASE 1.2 TESTING ENDS ===============================

    // =========================== RELEASE 2.0 TESTING ====================================

    //testing /badge controller
    it('should respond with an html file when /badge is requested', function (done) {
        console.log("\nRELEASE 2.0 TESTING STARTS\n");
        request(server)
            .get('/badge')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    //testing /leader controller
    it('should respond with an html file when /leader is requested', function (done) {
        request(server)
            .get('/leader')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    // testing /quizes controller
    it('should respond with an html file when /quizes is requested', function (done) {
        request(server)
            .get('/quizes')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    // testing /create controller
    it('should respond with an html file when /create is requested', function (done) {
        request(server)
            .get('/create')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    // testing /edit controller
    it('should respond with an html file when /edit is requested', function (done) {
        request(server)
            .get('/edit')
            .expect(200)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
                done();
            });
    });

    // testing error-processing controller
    it('should send 302 when a request is made to non-existing quiz', function (done) {
        request(server)
            .get('/answer/58f73b3e3d5ed229a479db4a')
            .expect(302)
            .end(function (err, response) {
                assert.equal(response.header['content-type'], 'text/plain; charset=utf-8');
                done();
            });
    });  

    // =========================== RELEASE 2.0 TESTING ENDS ===============================
});
