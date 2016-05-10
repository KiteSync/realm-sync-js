var async = require('async');
var AWS = require('aws-sdk');
var CONF = require('./config/config.json');

var config = {
  accessKeyId: CONF.AWS_ACCESS_KEY_ID,
  secretAccessKey: CONF.AWS_SECRET_ACCESS_KEY,
  region: "us-west-2"
};

AWS.config.update(config);
var dynamodb = new AWS.DynamoDB();
var s3 = new AWS.S3();

exports.handler = function (event, context) {
  console.log('hi from lambda check update');
  console.log(JSON.stringify(event, null, '  '));
  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey = event.Records[0].s3.object.key;
  // var dstBucket = srcBucket + "copied";
  // var dstKey    = "copied-" + srcKey;

  var data;
  async.waterfall([
      function downloadfromS3(next) {
        console.log('Getting code from S3...');
        s3.getObject({Bucket:srcBucket, Key: srcKey},next);
      },
      function uploadToDynamoDB(response, next) {
        console.log('response: ', response);
        var tableName = "users";

        dynamodb.putItem({
          "TableName": tableName,
          "Item": {
            "userID": {"S": "1"},
            "userName": {"S": "Alamu"}
          }
        }, next);
      }
    ],
    function (err, data) {
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('Success', data);
      }
      context.done();
    }
  );
};
        // s3.putObject({
        //   Bucket: dstBucket,
        //   Key: dstKey,
        //   Body: response.Body,
        //   ContentType: response.ContentType,
        //   ACL:'public-read' // Make publically available
        // },
        // next);
