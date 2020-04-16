const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.onText(/^\/addPrice/, function(msg){
    // comprobar que es un numero y si no pasar
    // comprobar la hora
    var chatId = msg.chat.id;
    let name = msg.from.first_name;
    let username = msg.from.username;
    let message = msg.text;
    message = Number(message.replace("/price ", ""));
    let date = msg.date;
    let time = new Date().getHours();
    let field = time < 12 ? "morning" : "evening"
    let messageTime = field == "morning" ? "mañana" : "tarde";
    try {
        if(Number.isInteger(message)) {
            bot.sendMessage(chatId, `${name} ha añadido ${message} como precio de venta en su turno de ${messageTime}`);
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