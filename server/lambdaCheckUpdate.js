var async = require('async');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = function (event, context) {
  console.log('hi from lambda check update');
  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey = event.Records[0].s3.object.key;
  var dstBucket = srcBucket + "copied";
  var dstKey    = "copied-" + srcKey;

  var data;
  async.waterfall([
      function download(next) {
        console.log('Getting code from S3...');
        s3.getObject({Bucket:srcBucket, Key: srcKey},next);
      },
      function upload(response, next) {
        console.log('response header: ', response.headers);
        s3.putObject({
          Bucket: dstBucket,
          Key: dstKey,
          Body: response.Body,
          ContentType: response.ContentType,
          ACL:'public-read' // Make publically available
        },
        next);
      }
    ],
    function (err) {
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('Success');
      }
      context.done();
    }
  );
};

// s3.getObject({Bucket:srcBucket, Key: srcKey}, function(err, response) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(response);
//   });
//   context.done(null, event);

