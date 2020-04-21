const usersService = require('../services/user.service');

exports.commands = {
    "sellPrice": new RegExp('^/venta'),
    "sellingList": new RegExp('^/dondeVender'),
    "purchasePrice": new RegExp('^/compra'),
    "purchaseList": new RegExp('^/dondeComprar'),
    "start": new RegExp('^/start'),
    "help": new RegExp('^/help'),
    "register": new RegExp('^/registro')
}

// morning and evening are attributes of the prices table, change onlye the values to show in the messages
exports.sellTurns = {
    "morning": "mañana",
    "evening": "tarde"
}

exports.errors = {
    "invalid_data": "Por favor, introduce un número después del comando",
    "sellPriceError": "Hubo un error al añadir el precio de venta",
    "is_sunday": `Hoy no se puede vender 😘`,
    "not_sunday": `Hoy no se compran nabos 😘`,
    "sellingList": "Lo lamento, hubo un error al pedir la lista",
    "purchasePriceError": "Hubo un error al añadir el precio de compra",
    "purchaseListError": "Lo lamento, hubo un error al pedir la lista",
    "helpError": "Lo lamento, hubo un error al pedir la  de comandos",
    "access_denied": "Debes estar registrado para poder usar comandos. Escríbeme /registro por privado",
    "membership_required": "Lo siento, sólo los miembros del club selecto pueden registrarse",
    "registerError": "Lo siento, hubo un error al crearte el usuario",
    "register_private": "Lo siento, para registrarte tienes que hablarme por privado"
}

exports.sellPriceResponse = (amount, turn) => {
    return `Has añadido ${amount} como tu precio de venta para hoy en el turno de ${turn} `
}

exports.purchasePriceResponse = (amount) => {
    return `Has añadido ${amount} como tu precio de compra para hoy`
}

exports.registerResponse = (name) => {
    return `${name} te has registrado con éxito`
}

exports.sellingList = {
    "title": "Estos son los precios de venta:",
    "noPrices": "Todavía no hay precios de venta para el turno actual"
}

exports.purchaseList = {
    "title": "",
    "noPrices": "Hoy todavía no tengo datos de compra"
}

exports.startBot = `Hola! Soy la versión 0.2.0 del nuevo Bot de comercio de nabos de @Annilou & @MercTISsue
\n Para empezar regístrate usando el comando /registro
\n Después usa /help para ver la lista de comandos disponibles`

exports.helpMessage = `Aquí tienes la lista de comandos disponibles:
\n /venta <Number>: Añadir un precio de venta en tu isla (calcula automáticamente a que turno pertenece)
\n /dondeVender: Muestra la lista de precios para vender hoy en el turno actual
\n /compra <Number>: Añadir un precio de compra en tu isla
\n /dondeComprar: Muestra la lista de precios de compra para hoy
`

exports.listPrices = async(dataArray, field) => {
    let text = "";
    for(i=0;i<dataArray.length;i++) {
        let userInfo = await usersService.getUser(dataArray[i].chat_id);
        // Modify this to change the arrangement of the prices list
        // Currently is like this
        // (line break) - userDisplayname: price
        // - Annilou: 45
        text = text + `\n - ${userInfo.displayName}: ${dataArray[i][field]} `
    }
    return text;
}