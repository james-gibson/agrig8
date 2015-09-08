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

var registerRoute = curry(function(securityLevel, category, name, urlPattern, handler) {
function applyPatternSettings(urlPattern)
{
    var prePattern = (config.enforceLeadingSlash && !urlPattern.match(/^\//)) ? '/' : '';
    var postPattern = (config.enforceTrailingSlash && !urlPattern.match(/\[\/\]$/)) ? '[/]?' : '';
    return prePattern + (urlPattern ? urlPattern.replace(/\/$/, '') + postPattern : '');
}

    var route = {
          "secured": securityLevel === SECURED
        , "category": category
        , "name": name
        , "pattern": urlPattern
        , "handler": handler
    };

    if(routes[urlPattern]) {
        registeredRouteError.emit('registrationError', route);
        return;
    }

    routes[urlPattern] = route;

    var eventToEmit = '';
    if(route.secured) {
        if(route.category === ADMINISTRATION.SYSTEM) {
            eventToEmit = 'registeredSystemRoute';
        }else if(route.category === ADMINISTRATION.USER) {
            eventToEmit = 'registeredUserRoute';
        }else if(route.category === ADMINISTRATION.STREAM) {
            eventToEmit = 'registeredStreamRoute';
        }else {
            eventToEmit = 'registeredSecuredRoute';
        }
    } else
    {
        eventToEmit = 'registeredPublicRoute';
    }
    registeredRoute.emit(eventToEmit, route);
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
