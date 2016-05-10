var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: '',
                   secretAccessKey:  ''});
                   
var dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    var params = {
        TableName : "RealmSync",
        // KeyConditionExpression: "#usn > :event.usn",
        // KeyConditionExpression: "#syncId = :syncId AND #usn > :usn",
        FilterExpression: "#usn > :usn",
        ExpressionAttributeNames:{
            "#usn": "usn"
            // "#syncId": "syncId"
        },
        "ExpressionAttributeValues": {
            ":usn": 1
            // ":syncId": "ANY"
        }
    };
    console.log('Received event:', JSON.stringify(event, null, 2));
    var cb = function(err, data) {
       if(err) {
          console.log('error on getLatestUpdates: ',err);
          context.done('Unable to retrieve updates information', null);
       } else {
            data.Items.forEach(function(obj) {
               console.log('Obj USN'+obj.usn);
            });
       }
    };

   dynamo.scan(params, cb);
};