const dynamodbService = require('./dynamodb.service');

exports.getUser = (userId) => {
    return dynamodbService.get({"chat_id": userId}, 'users')
        .then((user) => {
            if(!Object.keys(user).length) {
                throw "No user found"
            }
            return user;
        })
        .catch((err) => {
            //TODO: change error to promise resolve empty documents
            if(err == "No user found") {
                throw ({"errorTitle": "access_denied", "errorMessage": 'Tienes que ser un usuario registrado para poder usar comandos'});
            }else {
                throw err;
            }
        })
}