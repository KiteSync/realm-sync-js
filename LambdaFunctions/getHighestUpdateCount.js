var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: '',
                   secretAccessKey: ''});
                   
var dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    var params = {
        TableName : "RealmSync",
        KeyConditionExpression:  "#userId = :userId AND #usn = :usn",
        ExpressionAttributeNames:{
            "#userId": "userId",
            "#usn": "usn"
        },
        ExpressionAttributeValues: {
            ":userId": event.userId,
            ":usn": 0
        }
    };
    console.log(params);
    var cb = function(err, data) {
        console.log(data);
       if(err) {
          console.log('error on getLatestUpdates: ',err);
          context.done('Unable to retrieve updates information', null);
       } else {
            context.done(null, data.Items[0].updateCount);
       }
    }
    console.log(dynamo.query(params, cb));
    
}