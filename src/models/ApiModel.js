var curry = require('curry');
var EventEmitter = require('events').EventEmitter;
var config = require('../config.json');
var   registeredRoute = new EventEmitter()
    , registeredRouteError = new EventEmitter();

const PUBLIC = "public"
    , SECURED = "secured"
    , ADMINISTRATION = { SYSTEM: "systemAdministration", USER: "userAdministration", STREAM: "streamAdministration"
    };

var routes = {};

function applyPatternSettings(urlPattern)
{
    var prePattern = (config.enforceLeadingSlash && !urlPattern.match(/^\//)) ? '/' : '';
    var postPattern = (config.enforceTrailingSlash && !urlPattern.match(/\[\/\]$/)) ? '[/]?' : '';
    return prePattern + (urlPattern ? urlPattern.replace(/\/$/, '') + postPattern : '');
}

var registerRoute = curry(function(securityLevel, category, method, name, urlPattern, handler, parameters, description) {
    var enforcedPattern = applyPatternSettings(urlPattern);
    var routeKey = method + ':' + enforcedPattern;
    var route = {
          "secured": securityLevel === SECURED
        , "category": category
        , "method": method
        , "name": name
        , "pattern": enforcedPattern
        , "handler": handler
        , "parameters": parameters
        , "description": description
    };

    if(routes[routeKey]) {
        registeredRouteError.emit('registrationError', route);
        return;
    }

    routes[routeKey] = route;
    
    registeredRoute.emit('registeredSuccessfully', route);
});

const registerPublicRoute = registerRoute(PUBLIC, null);
const registerSystemAdminRoute = registerRoute(SECURED, ADMINISTRATION.SYSTEM);
const registerUserAdminRoute = registerRoute(SECURED, ADMINISTRATION.USER);
const registerStreamAdminRoute = registerRoute(SECURED, ADMINISTRATION.STREAM);


//Methods
exports.registerPublicRoute                 = registerPublicRoute;
exports.registerSystemAdministrationRoute   = registerSystemAdminRoute;
exports.registerUserAdministrationRoute     = registerUserAdminRoute;
exports.registerStreamAdministrationRoute   = registerStreamAdminRoute;

//Signals
exports.routeRegistered = registeredRoute;
exports.routeRegisteredError = registeredRouteError;

//State
exports.routes = routes;
