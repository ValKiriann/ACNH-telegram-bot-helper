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
    // comprobar que es un numero y si no pasar
    // comprobar la hora
    var chatId = msg.chat.id;
    let name = msg.from.first_name;
    let username = msg.from.username;
    let message = msg.text;
    message = Number(message.replace("/addPrice ", ""));
    let date = msg.date;
    let time = new Date().getHours();
    let field = time < 12 ? "morning" : "evening"
    let messageTime = field == "morning" ? "mañana" : "tarde";

    try {
        console.log(message)
        if(Number.isInteger(message)) {
            AWS.config.update({
                region: "eu-west-1",
                endpoint: "https://dynamodb.eu-west-1.amazonaws.com",
            });
            var docClient = new AWS.DynamoDB.DocumentClient();
            var today = new Date()
            var params = {
                TableName: "prices",
                Item: {
                    "date_by_user": dateFormat(today, "dd/mm/yyyy") + "#" + username,
                    "date": +new Date,
                    username,
                }
            };
            params.Item[field] = message 
            try {
                docClient.put(params, function(err, data) {
                    if (err) {
                        console.error("Unable to add price", message, ". Error JSON:", JSON.stringify(err, null, 2));
                        bot.sendMessage(chatId, `${name} hubo un error`);
                    } else {
                        console.log("PutItem succeeded:", params.Item.date_by_user);
                        bot.sendMessage(chatId, `${name} ha añadido ${message} como precio de venta en su turno de ${messageTime}`);
                    }
                    });
            } catch (error) {
                console.log(error)
            }
        }else {
            bot.sendMessage(chatId, `${name} por favor, introduce un número después del comando`);
        }
    } catch (error) {
        console.log(error)
        bot.sendMessage("error");

    }    
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
            console.log(err)
            if(err.errorTitle) {
                return bot.sendMessage(userId, err.errorMessage);
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
            user = userData;
            let today = new Date();
            let params = {
                TableName: 'prices',
                KeyConditionExpression: "#dt = :dddd",
                ExpressionAttributeNames: {
                    "#dt":"date"
                },
                ExpressionAttributeValues: {
                    ":dddd": dateFormat(today, "dd/mm/yyyy")
                }
            }
            return dynamodbService.query(params)
        })
        .then(async(itemList) => {
            let title = `${user.displayName} estos son los precios de compra:`;
            let composeMessage = await messageService.listPrices(itemList);
            return bot.sendMessage(userId, title + composeMessage);
        })
        .catch((err) => {
            console.log(err)
            if(err.errorTitle) {
                return bot.sendMessage(userId, err.errorMessage);
            }
            return bot.sendMessage(userId, `Lo lamento, hubo un error al pedir la lista`);
        })   
});

bot.onText(/^\/start/, function(msg){
    // comprobar que es un numero y si no pasar
    // comprobar la hora
    var chatId = msg.chat.id;
    let name = msg.from.first_name;
    let username = msg.from.username;
    
    bot.sendMessage(msg.chat.id, `Hola! Soy la versión 0.1.0 del nuevo Bot de comercio de nabos de @Annilou & @MercTISsue
        \n Para empezar regístrate usando el comando /registro
        \n Después usa /help para ver la lista de comandos disponibles`);
});

bot.onText(/^\/registro/, function(msg){
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    if(chatId != userId) {
        return botsService.sendMessage(chatId, `Lo siento, sólo puedes registrarte por privado!`);
    }
    bot.getChatMember(groupId, chatId)
        .then((chatMember) => {
            if(chatMember.status != "creator" && chatMember.status != "member") {
                throw {"errorTitle": "access denied", "errorMessage": `Lo siento, sólo los miembros del club selecto pueden registrarse`};
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
                return bot.sendMessage(userId, err.errorMessage);
            }
            return bot.sendMessage(chatId, `Lo siento, hubo un error al crearte el usuario`);
        })    
});