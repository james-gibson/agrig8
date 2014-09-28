/**
 * Created by James on 9/18/14.
 */

var authHandler = require('./handlers/AuthenticationHandler.js'),
    authModel = require('./models/AuthenticationModel.js'),
    handlers = {
        api: require('./handlers/ApiHandler.js'),
        numbers: require('./handlers/NumberHandler.js')
    };

function verifyUserKey(req,res,next) {
    var user = req.query.user;
    var key = req.query.key;
    var token = authModel.getToken(user,key);

    if(typeof key === "undefined"
        || user === "undefined"
        || !token) {
        res.statusCode = 401;
        return res.json({message:"Invalid User and Key", code:401});
    }

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
    //gets
    app.get('/', handlers.api.currentVersion);
    app.get('/api/authenticate[/]?',
        login,
        authHandler.authenticate);
    app.get('/api[/]?',
        auth,
        handlers.api.getRoutes);
    app.get('/api/number[/]?',
        auth,
        handlers.api.numbers.getNumbers);
   /* app.get('/api/summary[/]?',
        auth,
        handlers.resume.getSummary);
    app.get('/api/employment[/]?',
        auth,
        handlers.resume.getEmployment);
    app.get('/api/social[/]?',
        auth,
        handlers.resume.getSocial);
    app.get('/api/professional[/]?',
        auth,
        handlers.resume.getProfessional);
    app.get('/api/resume[/]?',
        auth,
        handlers.resume.getResume);
    app.get('/api/education[/]?',
        auth,
        handlers.resume.getEducation);*/
}