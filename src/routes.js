/**
 * Created by James on 9/18/14.
 */

var application,
    authHandler = require('./handlers/AuthenticationHandler.js'),
    authModel = require('./models/AuthenticationModel.js'),
    handlers = {
        api: require('./handlers/apiHandler.js'),
        numbers: require('./handlers/NumberHandler.js')
    };

function verifyUserKey(req,res,next) {
    if(typeof key === "undefined"
        || user === "undefined"
        || !token) {
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

exports.setup = function (app) {
    application = this.app;
    //handlers.api.setup(application);
    //gets
    //app.get('[/]?', handlers.api.currentVersion);
    app.get('/api/authenticate[/]?',
        login,
        authHandler.authenticate);
    app.get('/api[/]?',
        auth,
        handlers.api.getRoutes);
    app.get('/api/numbers/:id?',
        auth,
        handlers.numbers.getNumbers);
    app.post('/api/numbers/:id?',
        auth,
        handlers.numbers.postNumbers);
}