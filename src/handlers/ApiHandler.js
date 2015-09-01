/**
 * Created by James on 9/18/14.
 */
var fs = require('fs');
var config = require('../config.json');
var apiModel = require('../models/ApiModel.js');

var apiRoutes = apiModel.routes;

exports.currentVersion = currentVersion;
exports.getRoutes = getRoutes;


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
    function convertRouteToUrl(index) {
        if(index == apiRoutes.length) {
            res.json(urls);
            return;
        }
        urls.push(config.host+apiRoutes[index]+"?token="+req.token);
        index++
        convertRouteToUrl(index);
    }

    convertRouteToUrl(0);
}