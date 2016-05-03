// use strict;
var async = require('async');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = function (event, context) {
  console.log('hi from lambda check update');
  // AWS.config.loadFromPath('../config/config.json');
  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey = event.Records[0].s3.object.key;
  // var dstBucket = srcBucket + "copied";
  // var dstKey    = "copied-" + srcKey;
  
  s3.getObject({Bucket:srcBucket, Key: srcKey}, function(err, response) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(response);
    res = response;
  });
  console.log(res);
  context.done(null, event);

  // async.waterfall([
  //   function download(next) {
  //     s3.getObject({Bucket:srcBucket, Key: srcKey}, next);
  //   },
  //   function copy(response, next) {
  //     s3.putObject({
  //         Bucket: dstBucket,
  //         Key: dstKey,
  //         // Body: response.body,
  //         ContentType: response.ContentType,
  //         ACL: 'public-read'
  //       },
  //       next);
  //     }
  //   ], function (err) {
  //     if (err) {
  //       console.error(
  //         'Unable to copy ' + srcBucket + '/' + srcKey +
  //         ' to ' + dstBucket + '/' + dstKey +
  //         ' due to an error: ' + err
  //       );
  //     } else {
  //       console.log(
  //         'Successfully copied ' + srcBucket + '/' + srcKey +
  //         ' to ' + dstBucket + '/' + dstKey
  //       );
  //     }

  //     context.done(null, event);
  //   }
  // );
};
