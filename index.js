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
const pricesTable = process.env.PRICES_TABLE;
const usersTable = process.env.USERS_TABLE;

const dynamodbService = require('./services/dynamodb.service');
const textService = require('./services/text.service');
const usersService = require('./services/user.service');
const template = require('./resources/template.resource');

bot.onText(template.commands.sellPrice, function(msg){
    let chatId = msg.chat.id;
    let userId = msg.from.id;
    let amount;
    //TODO: meter esto en una función
    let hour = new Date().getHours() + Number(process.env.TIMEZONE);
    let field = hour < 12 ? "morning" : "evening"
    let date = dateFormat(new Date(), "dd/mm/yyyy");
    return usersService.getUser(userId)
        .then((userData) => {
            if(new Date().getDay() == 0) {
                throw {"errorTitle": "is_sunday", "errorMessage": template.errors.is_sunday};
            }
            amount = Number(textService.cleanCommand(msg.text));
            if(!Number.isInteger(amount)){
                throw {"errorTitle": "invalid data", "errorMessage": template.errors.invalid_data};
            }
            return dynamodbService.get({date, "chat_id":chatId}, pricesTable)            
        })
        .then((exists) => {
            if(Object.keys(exists).length) {
                var params = {
                    TableName: pricesTable,
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
                return dynamodbService.put(params, pricesTable)
            }
        })
        .then((document) => {
            return bot.sendMessage(userId, template.sellPriceResponse(amount, template.sellTurns[field]));
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, template.errors.sellPriceError);
        })   
});

bot.onText(template.commands.sellingList, function(msg){
    var chatId = msg.chat.id;
    let userId = msg.from.id
    let hour = new Date().getHours() + Number(process.env.TIMEZONE);
    let field = hour < 12 ? "morning" : "evening";

    return usersService.getUser(userId)
        .then((userData) => {
            if(new Date().getDay() == 0) {
                throw {"errorTitle": "is_sunday", "errorMessage": template.errors.is_sunday};
            }
            let date = dateFormat(new Date(), "dd/mm/yyyy");
            let params = {
                TableName: pricesTable,
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
                let title = template.sellingList.title;
                let composeMessage = await template.listPrices(itemList, field);
                return bot.sendMessage(userId, title + composeMessage);
            }
            return bot.sendMessage(userId, template.sellingList.noPrices);
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, template.errors.sellingList);
        })   
});

bot.onText(template.commands.purchasePrice, function(msg){
    let chatId = msg.chat.id;
    let userId = msg.from.id;
    let amount;

    return usersService.getUser(userId)
        .then((userData) => {
            if(new Date().getDay() != 0) {
                throw {"errorTitle": "not sunday", "errorMessage": template.errors.not_sunday};
            }
            amount = Number(textService.cleanCommand(msg.text));
            if(!Number.isInteger(amount)){
                throw {"errorTitle": "invalid data", "error_data": template.errors.invalid_data};
            } 
            let today = new Date();
            let params = {
                "date": dateFormat(today, "dd/mm/yyyy"),
                "timestamp": +new Date,
                "chat_id": chatId,
                "purchase": amount
            }
            return dynamodbService.put(params, pricesTable)
        })
        .then(() => {
            return bot.sendMessage(userId, template.purchasePriceResponse(amount));
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, template.errors.purchasePriceError);
        })   
});

bot.onText(template.commands.purchaseList, function(msg){
    var chatId = msg.chat.id;
    let userId = msg.from.id

    return usersService.getUser(userId)
        .then((userData) => {
            if(new Date().getDay() != 0) {
                throw {"errorTitle": "not sunday", "errorMessage": template.errors.not_sunday};
            }
            let date = dateFormat(new Date(), "dd/mm/yyyy");
            let params = {
                TableName: pricesTable,
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
                let composeMessage = await template.listPrices(itemList, "purchase");
                return bot.sendMessage(userId, title + composeMessage);
            }
            return bot.sendMessage(userId, template.purchaseList.noPrices);
        })
        .catch((err) => {
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, template.errors.purchaseListError);
        })   
});

bot.onText(template.commands.start, function(msg){
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, template.startBot);
});

bot.onText(template.commands.help, function(msg){
    var chatId = msg.chat.id;
    let userId = msg.from.id

    return usersService.getUser(userId)
        .then((userData) => {
            //TODO: format
            bot.sendMessage(chatId, template.helpMessage);
        })
        .catch((err) => {
            console.log(err)
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(userId, template.errors.helpError);
        })  
});

bot.onText(template.commands.register, function(msg){
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    console.log(`Si has lanzado este comando desde el chat grupal, el groupId es: ${chatId}`)
    if(chatId != userId) {
        throw {"errorTitle": "register_private", "errorMessage": template.errors.register_private};
    }
    bot.getChatMember(groupId, chatId)
        .then((chatMember) => {
            if(chatMember.status != "creator" && chatMember.status != "member") {
                throw {"errorTitle": "membership_required", "errorMessage": template.errors.membership_required};
            }
            let username = msg.from.username ? msg.from.username : "";
            let params = {
                "chat_id": chatId,
                username,
                "displayName": chatMember.user.first_name
            }
            return dynamodbService.put(params, usersTable)
        })
        .then((onInsert) => {
            return bot.sendMessage(chatId, template.registerResponse(onInsert.displayName));
        })
        .catch((err) => {
            console.log(err)
            if(err.errorTitle) {
                let response = err.errorTitle == "access_denied" ? chatId : userId;
                return bot.sendMessage(response, err.errorMessage);
            }
            return bot.sendMessage(chatId, template.errors.registerError);
        })    
});