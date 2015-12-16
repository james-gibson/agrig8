var should = require('chai').should();
var done = require("chai").done;
var model = require("../../src/models/ApiModel");
var EventEmitter = require('events').EventEmitter;

describe("API Model", function() {
    describe("Initial Route Definition", function() {
        it("Should be empty", function() {
            model.routes.should.be.an('object');
        });
    });

    describe("Register Route", function() {
        var routeRegistered = model.routeRegistered;
        var routeRegisteredError = model.routeRegisteredError;

        it("Should initially be empty", function() {
            model.routes.should.be.an('object');
        });

        it("Should emit registeredSuccessfully on route registration", function() {
            routeRegistered.on('registeredSuccessfully', function (route) {
                route.should.be.an('object');

            });
        });

    });
});