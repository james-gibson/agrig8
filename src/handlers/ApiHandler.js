//var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var curry = require('curry');
var config = require('../config.json');
var apiModel = require('../models/ApiModel.js');

var apiRoutes = apiModel.routes;
var authHandler = require('./AuthenticationHandler.js'),
    authModel = require('../models/AuthenticationModel.js');

function verifyUserKey(req,res,next) {
    if(typeof req.query.key === "undefined"
        || req.query.user === "undefined") {
        res.statusCode = 401;
        return res.json({message:"Invalid User and Key", code:401});
    }

    var streamToken = req.query.id;
    var key = req.query.key;
    var token = authModel.getToken(user,key);

    req.token = token;
    next();
}

function verifyAPIToken(req,res,next) {
    var token = req.query.token;

    if(!authModel.validateToken(token)) {
        res.statusCode = 401;
        return res.json({message:"Invalid Token", code:401});
    }

    req.token = token;
    next();
}

var login = [
    verifyUserKey
];
var auth = [
    verifyAPIToken
];

function currentVersion(req,res) {
    var result = {
        version:"0.1",
        about:"This API acts as a gateway for disparate data sources",
        why:"Why not?",
        authentication: {URL:config.host +"api/authenticate",queryParameters:["user","key"]}
    };
    res.json(result);
}

function getRoutes(req,res) {
    var urls = [];

    for (var route in apiRoutes) {
        var url = {};
        url[route] = {
                'description': apiRoutes[route].description
                , 'parameters': apiRoutes[route].parameters
            };

        urls.push(url);
    }

    res.json(urls);
}

function setup(app) {
    apiModel.routeRegistered.on('registeredSuccessfully', function (route) {

        app.get(applyPatternSettings(route.pattern), route.handler);
    });

    setupRoutes();
}

function preRegisterRoute(route) {
    var tempRoute = route;

    if (config.logRouteRegistration) {
        console.log(JSON.stringify(tempRoute));
    }
}
function setupRoutes() {
    //Not sure if these should be in this class
    apiModel.registerPublicRoute('displayCurrentVersion', '', currentVersion);
    apiModel.registerPublicRoute('displayAvailableRoutes', '/routes', getRoutes);
}

exports.setup = setup;
exports.currentVersion = currentVersion;
exports.getRoutes = getRoutes;