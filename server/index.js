var AWS = require('aws-sdk');
var CONF = require('../config/config.json');
var lambda = {};

function handleRespFromLambda(err, response) {
  if (err) {
    console.dir(err);
    return;
  }
  var data = JSON.parse(response.Payload);
  console.dir(data);
}

function runFuncOnLambda(fn_str, payload) {
  var settings = {
    FunctionName: fn_str,
    Payload: JSON.stringify(payload)
  };
  lambda.invoke(settings, handleRespFromLambda);
}

function init() {
  AWS.config = new AWS.Config({
    accessKeyId: CONF.AWS_ACCESS_KEY_ID,
    secretAccessKey: CONF.AWS_SECRET_ACCESS_KEY,
    region: "us-west-2"
  });
  lambda = new AWS.Lambda();
  runFuncOnLambda("concatenate", {
    "key2": "World!!",
    "key1": "Hello,"
  });
}

init();