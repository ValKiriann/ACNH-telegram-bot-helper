const dynamodbService = require('./dynamodb.service');

exports.getUser = (userId) => {
    return dynamodbService.get({"chat_id": userId}, 'users')
        .catch((err) => {
            //TODO: change error to promise resolve empty documents
            if(err == "No document found") {
                throw ('Tienes que ser un usuario registrado para poder usar comandos');
            }else {
                throw err;
            }
        })
}