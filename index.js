const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const AWS = require('aws-sdk');
const dateFormat = require('dateformat');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.SP_AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.SP_AWS_SECRET_ACCESS_KEY;

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
    // comprobar que es un numero y si no pasar
    // comprobar la hora
    var chatId = msg.chat.id;
    let name = msg.from.first_name;
    let username = msg.from.username;
    let message = msg.text;
    message = Number(message.replace("/compra ", ""));
    let date = msg.date;
    console.log(JSON.stringify(msg));
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
                TableName: "prices-2",
                Item: {
                    "date": dateFormat(today, "dd/mm/yyyy"),
                    "timestamp": +new Date,
                    username,
                    "purchase": message
                }
            };
            try {
                docClient.put(params, function(err, data) {
                    if (err) {
                        console.error("Unable to add price", message, ". Error JSON:", JSON.stringify(err, null, 2));
                        bot.sendMessage(chatId, `${name} hubo un error`);
                    } else {
                        console.log("PutItem succeeded:", params.Item.date_by_user);
                        bot.sendMessage(chatId, `${name} ha añadido ${message} como precio de compra`);
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

bot.onText(/^\/dondeComprar/, function(msg){
    // comprobar que es un numero y si no pasar
    // comprobar la hora
    var chatId = msg.chat.id;
    let name = msg.from.first_name;
    let username = msg.from.username;
    
    AWS.config.update({
        region: "eu-west-1",
        endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "prices-2";
    let today = new Date();

    var params = {
        TableName: table,
        KeyConditionExpression: "#dt = :dddd",
        ExpressionAttributeNames:{
            "#dt": "date"
        },
        ExpressionAttributeValues: {
            ":dddd": dateFormat(today, "dd/mm/yyyy")
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            bot.sendMessage(chatId, `${name} hubo un error`);
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            data = data.Items
            if(data.length == 0) {
                bot.sendMessage(chatId, "Todavía no tengo precios de compra para hoy!");
            }else {
                let text = `${name} estos son los precios de compra: `
                for(i=0;i<data.length;i++) {
                    text = text + `\n - ${data[i].username}: ${data[i].purchase} `
                }
                bot.sendMessage(chatId, text);
            }
                
        }
    });

});

bot.onText(/^\/start/, function(msg){
    // comprobar que es un numero y si no pasar
    // comprobar la hora
    var chatId = msg.chat.id;
    let name = msg.from.first_name;
    let username = msg.from.username;
    
    bot.sendMessage(msg.chat.id, `Hola! Soy la versión 0.0.1 del nuevo Bot de comercio de nabos de @Annilou & @MercTISsue
        \n Para añadir un precio de compra de nabos los domingos usa el comando /compra precio
        \n Ej: /compra 96
        \n Para ver la lista de precios de compra actualizada usa /dondeComprar`);
});

/*
bot.on('message', function(msg){
    console.log(msg);
    var chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});
*/