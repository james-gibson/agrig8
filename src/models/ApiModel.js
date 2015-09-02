var curry = require('curry');
var EventEmitter = require('events').EventEmitter;
var   registeredRoute = new EventEmitter()
    , registeredRouteError = new EventEmitter();

const PUBLIC = "public"
    , SECURED = "secured"
    , ADMINISTRATION = { SYSTEM: "systemAdministration", USER: "userAdministration", STREAM: "streamAdministration"
    };

var routes = {};

var registerRoute = curry(function(securityLevel, category, name, urlPattern, handler) {
    var route = {
          "secured": securityLevel === SECURED
        , "category": category
        , "name": name
        , "pattern": urlPattern
        , "handler": handler
    };
    if(routes[urlPattern]) { registeredRouteError.emit('registrationError', route); return;}

    if(!route.secured) {

    }
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
