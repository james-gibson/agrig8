/**
 * Created by James on 9/20/14.
 */

var numberModel = require('../models/NumbersModel.js');

exports.getNumbers = getNumbers;
exports.postNumbers = postNumbers;

function getNumbers(req, res) {
    if(req.value == 'undefined'){
        callback(null,null);
    }
    numberModel.retrieveNumbers
}

function postNumbers(req, res){

}
