const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.update({
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com",
});

exports.put = (params, table) => {
    var docClient = new AWS.DynamoDB.DocumentClient();   
    var putParams = {
        TableName: table,
        Item: params
    };
    try {
        return new Promise((resolve, reject) => {
            docClient.put(putParams, function(err, data) {
                if (err) {
                    console.error("Unable to create document", message, ". Error JSON:", JSON.stringify(err, null, 2));
                    reject (JSON.stringify(err, null, 2));
                } else {
                    console.log("Document created:", params.chat_id);
                    resolve ('Document created');
                }
            });
        })
    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.get = (params, table) => {      
    var docClient = new AWS.DynamoDB.DocumentClient();
      
    var getParams = {
        TableName: table,
        Key:params
    };
    return new Promise((resolve, reject) => {
        docClient.get(getParams, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                reject (`Hubo un error al intentar hacer login`);
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                if(!data.Item) {
                    reject('No document found');
                }else {
                    resolve (data.Item);
                }
            }
        });
    })
}