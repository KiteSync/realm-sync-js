var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: '',
                   secretAccessKey: ''});
                   
var dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    var params = {
        TableName : "RealmSync",
        KeyConditionExpression:  "#userId = :userId AND #usn >= :usn",
        ExpressionAttributeNames:{
            "#usn": "usn",
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":usn": event.lastUpdate,
            ":userId": event.userId
        }
    };
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('params', params);
    var cb = function(err, data) {
        console.log(data.Items);
       if(err) {
          console.log('error on getLatestUpdates: ',err);
          context.done('Unable to retrieve updates information', null);
       } else {
            data.Items.forEach(function(obj) {
               console.log('Obj USN'+obj.usn);
            //   context.done('null', obj);
            });
            context.done(null, data.Items);
       }
    };
    console.log('cb set');
   console.log(dynamo.query(params, cb));
};