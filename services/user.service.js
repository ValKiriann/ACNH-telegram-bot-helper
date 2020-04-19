const dynamodbService = require('./dynamodb.service');

exports.getUser = (userId) => {
    return dynamodbService.get({"chat_id": userId}, 'users')
        .catch((err) => {
            if(err == "No document found") {
                throw ('Tienes que ser un usuario registrado para poder usar comandos');
            }else {
                throw err;
            }
        })
}