
exports.retrieveNumbers = retrieveNumbers;
exports.insertNumber = insertNumber;

var numbersById = {};

retrieveNumbers = function(id, callback){
    if(id == 'undefined'){
        callback(null,null);
    }

    var values = numbersById[id];
    callback(null,values);
}

insertNumber = function(id, value, callback){
    if(id == 'undefined'){
        callback(null,null);
    }

    numbersById[id].push(value);
    callback(null,values);
}


