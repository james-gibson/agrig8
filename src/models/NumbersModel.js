
exports.retrieveNumbers = retrieveNumbers;

var numbersById = {};

retrieveNumbers = function(id, callback){
    if(id == 'undefined'){
        callback(null,null);
    }

    var values = numbersById[id];
    callback(null,values);
}


