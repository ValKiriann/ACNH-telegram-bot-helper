const usersService = require('./user.service');

exports.listPrices = async(dataArray) => {
    let text = "";
    for(i=0;i<dataArray.length;i++) {
        let userInfo = await usersService.getUser(dataArray[i].chat_id);
        text = text + `\n - ${userInfo.displayName}: ${dataArray[i].purchase} `
    }
    return text;
}