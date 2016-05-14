var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
// var DOC = require('dynamodb-doc');
// var dynamo = new DOC.DynamoDB();

AWS.config.update({accessKeyId: '',
                   secretAccessKey:  ''});
                   
var dynamo = new AWS.DynamoDB.DocumentClient();                   
                   
exports.handler = function(event, context) {
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

    //if table does not exist create RealmSync Table, described above in params
    console.log("BeforeDescribe");
    dynamodb.describeTable({TableName: "RealmSync"}, function(err,result) {
      if(err){
        console.log("err is "+err);
        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                event.forEach(function(item){
                    console.log(item);
                    dynamo.put({TableName:event.userId, Item:item}, cb);
                });
            }
        });
      }
      else{
        console.log("Table exists"+result);
      }
    });
    console.log(event);
    
    var cb = function(err, data) {
        if(err) {
            console.log(err);
            context.fail('unable to update events at this time');
        } else {
            console.log(data);
                context.done(null, data);
        }
    };    
    event.forEach(function(item){
        console.log(item);

        dynamo.put({TableName: "RealmSync", Item:item}, cb);
    });
   
};