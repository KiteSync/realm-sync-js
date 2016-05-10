var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
// var DOC = require('dynamodb-doc');
// var dynamo = new DOC.DynamoDB();

AWS.config.update({accessKeyId: '',
                   secretAccessKey:  ''});
                   
var dynamo = new AWS.DynamoDB.DocumentClient();                   
                   
var params = {
    TableName : "RealmSync",
    KeySchema: [       
        { AttributeName: "syncId", KeyType: "HASH"},  //Partition key
        { AttributeName: "usn", KeyType: "RANGE" },  //Sort key
        { AttributeName: "obj" }
    ],
    AttributeDefinitions: [       
        { AttributeName: "syncId", AttributeType: "S" },
        { AttributeName: "usn", AttributeType: "N" },
        { AttributeName: "obj", AttributeType: "M" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

exports.handler = function(event, context) {
    //if table does not exist create RealmSync Table, described above in params
    dynamodb.describeTable({TableName:"RealmSync"}, function(err,result) {
      if(err){
        console.log("err is "+err);
        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
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
        dynamo.put({TableName:"RealmSync", Item:item}, cb);
    });
   
};