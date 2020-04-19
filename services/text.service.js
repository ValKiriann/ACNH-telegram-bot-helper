exports.cleanCommand = (message) => {
    return message.replace(/^\/\w+\s/, "");
}