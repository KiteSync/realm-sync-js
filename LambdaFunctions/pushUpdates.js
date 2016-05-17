var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

AWS.config.update({accessKeyId: 'AKIAJA42RE5SATXJHMFA',
                   secretAccessKey:  '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'});
                   
var dynamo = new AWS.DynamoDB.DocumentClient();   
var params = {
    TableName : "RealmSync",
    AttributeDefinitions: [       
        { AttributeName: "userId", AttributeType: "S" },
        { AttributeName: "usn", AttributeType: "N" }
    ],
    KeySchema: [       
        { AttributeName: "userId", KeyType: "HASH"},  //Partition key
        { AttributeName: "usn", KeyType: "RANGE" }  //Sort key
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};
                   
exports.handler = function(event, context) {
    console.log(event.userId);
    var cb = function(err, data) {
        if(err) {
            console.log(err);
            context.fail('unable to update events at this time');
        } else {
            console.log(data);
            context.done(null, data);
        }
    }; 
    
    var getUpdateCount = function (err, data) {
        
        if (err) {
            console.log('err is', err)
            console.log(dynamo.put({TableName:"RealmSync", Item:{"userId": event.userId, "usn": 0, "updateCount": 0}}, function(err, result){
              if (err) {
                  console.log('put err is', err)
                  context.done(err,null);
              } else {
                  console.log('update count');
                    var updateCount = 0;
                    updateLogs(updateCount);
                    var highUSN = updateCount + event.logs.length;
                    updateHighUSN(highUSN);
              }
            }));
        } else {
            console.log(data);
            var updateCount = data.Items[0].updateCount;
            console.log('UC',updateCount);
            updateLogs(updateCount);
            var highUSN = updateCount + event.logs.length;
            updateHighUSN(highUSN);
        }
    };
    
    var updateHighUSN = function (highUSN) {    
        console.log("highUSN", highUSN);
        dynamo.put({TableName:"RealmSync", Item:{"userId": event.userId, "usn": 0, "updateCount": highUSN}}, cb);
    };
    
    var updateLogs = function (updateCount) {
        event.logs.forEach(function(item){
            console.log(item);
            item.usn += updateCount;
            item.userId = event.userId;
            console.log(dynamo.put({TableName: "RealmSync", Item:item}, cb));
        });
    };
    
    if(!event.userId) {
        context.done('no userID passed', null);
    } else {
        console.log('user', event.userId)
        dynamo.query({
            TableName: "RealmSync", 
            KeyConditionExpression:  "#userId = :userId AND #usn = :usn",
            ExpressionAttributeNames:{
                "#userId": "userId",
                "#usn": "usn"
            },
            ExpressionAttributeValues: {
                ":userId": event.userId,
                ":usn": 0
            }
        }, getUpdateCount);
    }
    
};