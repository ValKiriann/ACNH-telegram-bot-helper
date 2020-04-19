const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const AWS = require('aws-sdk');
const dateFormat = require('dateformat');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/^\/addPrice/, function(msg){
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
            let credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
            AWS.config.update({
                region: "eu-west-1",
                endpoint: "https://dynamodb.eu-west-1.amazonaws.com",
                credentials
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

/*
bot.on('message', function(msg){
    console.log(msg);
    var chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});
*/