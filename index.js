const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const AWS = require('aws-sdk');
const dateFormat = require('dateformat');
const token = process.env.TELEGRAM_BOT_TOKEN;
const groupId = process.env.GROUP_ID;
const bot = new TelegramBot(token, {polling: true});
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.SP_AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.SP_AWS_SECRET_ACCESS_KEY;

const dynamodbService = require('./services/dynamodb.service');
const textService = require('./services/text.service');
const usersService = require('./services/user.service');
const messageService = require('./services/message.service');

bot.onText(/^\/venta/, function(msg){
    let chatId = msg.chat.id;
    let userId = msg.from.id;
    let amount;
    let table = "prices";
    let message = {
        "morning": "mañana",
        "evening": "tarde"
    }
    //TODO: meter esto en una función
    let hour = new Date().getHours() + process.env.TIMEZONE;
    let field = hour < 12 ? "morning" : "evening"
    let date = dateFormat(new Date(), "dd/mm/yyyy");
    return usersService.getUser(userId)
        .then((userData) => {
            amount = Number(textService.cleanCommand(msg.text));
            if(!Number.isInteger(amount)){
                throw {"errorTitle": "invalid data", "errorMessage": `Por favor, introduce un número después del comando`};
            }
            let params = {
                date,
                "chat_id": chatId
            }
            return dynamodbService.get(params, table)            
        })
        .then((exists) => {
            if(Object.keys(exists).length) {
                var params = {
                    TableName:table,
                    Key:{
                        date,
                        "chat_id": userId
                    },
                    UpdateExpression: `set ${field} = :a`,
                    ExpressionAttributeValues:{
                        ":a":amount,
                    },
                    ReturnValues:"UPDATED_NEW"
                };
                return dynamodbService.update(params)
            }else {
                let params = {
                    date,
                    "timestamp": +new Date,
                    "chat_id": userId,
                }
                params[field] = amount
                return dynamodbService.put(params, table)
            }
        })
        .then((document) => {
            return bot.sendMessage(userId, `Has añadido ${amount} como tu precio de compra para hoy en el turno de ${message[field]} `);
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, `hubo un error al añadir el precio de compra`);
        })   
});

bot.onText(/^\/dondeVender/, function(msg){
    var chatId = msg.chat.id;
    let userId = msg.from.id
    let user;
    let hour = new Date().getHours();
    let field = hour < 12 ? "morning" : "evening"

    return usersService.getUser(userId)
        .then((userData) => {
            if(new Date().getDay() == 0) {
                throw {"errorTitle": "is sunday", "errorMessage": `Hoy no se puede vender 😘`};
            }
            user = userData;
            let date = dateFormat(new Date(), "dd/mm/yyyy");
            let params = {
                TableName: 'prices',
                KeyConditionExpression: "#dt = :dddd",
                ExpressionAttributeNames: {
                    "#dt":"date",
                    "#f": field
                },
                FilterExpression:"attribute_exists(#f)",
                ExpressionAttributeValues: {
                    ":dddd": date
                    
                }
            }
            return dynamodbService.query(params)
        })
        .then(async(itemList) => {
            if(itemList.length) {
                let title = `Estos son los precios de venta:`;
                let composeMessage = await messageService.listPrices(itemList, field);
                return bot.sendMessage(userId, title + composeMessage);
            }
            return bot.sendMessage(userId, "Todavía no hay precios de venta para el turno actual");
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, `Lo lamento, hubo un error al pedir la lista`);
        })   
});

bot.onText(/^\/compra/, function(msg){
    let chatId = msg.chat.id;
    let userId = msg.from.id;
    let amount;

    return usersService.getUser(userId)
        .then((userData) => {
            amount = Number(textService.cleanCommand(msg.text));
            if(!Number.isInteger(amount)){
                throw {"errorTitle": "invalid data", "errorMessage": `Por favor, introduce un número después del comando`};
            } 
            let today = new Date();
            let params = {
                "date": dateFormat(today, "dd/mm/yyyy"),
                "timestamp": +new Date,
                "chat_id": chatId,
                "purchase": amount
            }
            return dynamodbService.put(params, 'prices')
        })
        .then((onInsert) => {
            return bot.sendMessage(userId, `Has añadido ${amount} como tu precio de compra para hoy`);
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, `hubo un error al añadir el precio de compra`);
        })   
});

bot.onText(/^\/dondeComprar/, function(msg){
    var chatId = msg.chat.id;
    let userId = msg.from.id
    let user;

    return usersService.getUser(userId)
        .then((userData) => {
            if(new Date().getDay() != 0) {
                throw {"errorTitle": "not sunday", "errorMessage": `Hoy no se compran nabos 😘`};
            }
            user = userData;
            let date = dateFormat(new Date(), "dd/mm/yyyy");
            let params = {
                TableName: 'prices',
                KeyConditionExpression: "#dt = :dddd",
                ExpressionAttributeNames: {
                    "#dt":"date",
                    "#p": "purchase"
                },
                FilterExpression:"attribute_exists(#p)",
                ExpressionAttributeValues: {
                    ":dddd": date
                    
                }
            }
            return dynamodbService.query(params)
        })
        .then(async(itemList) => {
            if(itemList.length) {
                let title = `Estos son los precios de compra:`;
                let composeMessage = await messageService.listPrices(itemList, "purchase");
                return bot.sendMessage(userId, title + composeMessage);
            }
            return bot.sendMessage(userId, "Hoy todavía no tengo datos de compra");
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, `Lo lamento, hubo un error al pedir la lista`);
        })   
});

bot.onText(/^\/start/, function(msg){
    var chatId = msg.chat.id;
    
    bot.sendMessage(msg.chat.id, `Hola! Soy la versión 0.1.0 del nuevo Bot de comercio de nabos de @Annilou & @MercTISsue
        \n Para empezar regístrate usando el comando /registro
        \n Después usa /help para ver la lista de comandos disponibles`);
});

bot.onText(/^\/help/, function(msg){
    var chatId = msg.chat.id;
    let userId = msg.from.id

    return usersService.getUser(userId)
        .then((userData) => {
            //TODO: format
            bot.sendMessage(msg.chat.id, `Aquí tienes la lista de comandos disponibles:
                \n /venta <Number>: Añadir un precio de venta en tu isla (calcula automáticamente a que turno pertenece)
                \n /dondeVender: Muestra la lista de precios para vender hoy en el turno actual
                \n /compra <Number>: Añadir un precio de compra en tu isla
                \n /dondeComprar: Muestra la lista de precios de compra para hoy
                `);
        })
        .catch((err) => {
            console.log(err)
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, `Lo lamento, hubo un error al pedir la lista`);
        })  
});

bot.onText(/^\/registro/, function(msg){
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    if(chatId != userId) {
        throw {"errorTitle": "access_denied", "errorMessage": `Lo siento, para registrarte tienes que hablarme por privado`};
    }
    bot.getChatMember(groupId, chatId)
        .then((chatMember) => {
            if(chatMember.status != "creator" && chatMember.status != "member") {
                throw {"errorTitle": "access_denied", "errorMessage": `Lo siento, sólo los miembros del club selecto pueden registrarse`};
            }
            let username = msg.from.username ? msg.from.username : "";
            let params = {
                "chat_id": chatId,
                username,
                "displayName": chatMember.user.first_name
            }
            return dynamodbService.put(params, 'users')
        })
        .then((onInsert) => {
            return bot.sendMessage(chatId, `${onInsert.displayName} te has registrado con éxito`);
        })
        .catch((err) => {
            console.log(err)
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(chatId, `Lo siento, hubo un error al crearte el usuario`);
        })    
});