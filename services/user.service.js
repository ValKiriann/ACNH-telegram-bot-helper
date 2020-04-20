const dynamodbService = require('./dynamodb.service');
const template = require('../resources/template.resource');
const usersTable = process.env.USERS_TABLE;

exports.getUser = (userId) => {
    return dynamodbService.get({"chat_id": userId}, usersTable)
        .then((user) => {
            if(!Object.keys(user).length) {
                throw "No user found"
            }
            return user;
        })
        .catch((err) => {
            //TODO: change error to promise resolve empty documents
            if(err == "No document found") {
                throw ({"errorTitle": "access_denied", "errorMessage": template.errors.access_denied});
            }else {
                throw err;
            }
        })
}