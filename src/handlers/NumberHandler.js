var apiModel = require('../models/apiModel.js');
apiModel.registerStreamAdministrationRoute("stream", '[/]?', function(){});
var numberModel = require('../models/NumbersModel.js');

function getNumbers(req, res) {
    if(req.value == 'undefined'){
        callback(null,null);
    }
    numberModel.retrieveNumbers
}

function postNumbers(req, res){

}

exports.getNumbers = getNumbers;
exports.postNumbers = postNumbers;

