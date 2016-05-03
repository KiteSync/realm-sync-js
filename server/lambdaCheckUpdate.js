var async = require('async');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = function (event, context) {
  console.log('hi from lambda check update');
  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey = event.Records[0].s3.object.key;

  s3.getObject({Bucket:srcBucket, Key: srcKey}, function(err, response) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(response);
  });
  context.done(null, event);
};

