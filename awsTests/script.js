// //0. Set up AWS cradentials
//
// var awsConfig = {
//   accessKeyId: 'AKIAJCLABE65UW3RF2NA',
//   secretAccessKey: '9wt+IQnM83nmohzykTtTEt7A8cYIQPvwVRI+lipy'
// };
//
// AWS.config.credentials = new AWS.WebIdentityCredentials(awsConfig);
//
// // Configure your region
// AWS.config.region = 'us-east-1';
// //
// // ide Access Key
// // Access Key ID:
// // AKIAJCLABE65UW3RF2NA
// // Secret Access Key:
// // 9wt+IQnM83nmohzykTtTEt7A8cYIQPvwVRI+lipy
//
//
// //1. Upload to s3
//
//   var bucket = new AWS.S3({params: {Bucket: 'offsync'}});
//   var fileChooser = document.getElementById('file-chooser');
//   var button = document.getElementById('upload-button');
//   var results = document.getElementById('results');
//   button.addEventListener('click', function() {
//     var file = fileChooser.files[0];
//     if (file) {
//       results.innerHTML = '';
//
//       var params = {Key: file.name, ContentType: file.type, Body: file};
//       bucket.upload(params, function (err, data) {
//         results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
//         console.log(err);
//       });
//     } else {
//       results.innerHTML = 'Nothing to upload.';
//     }
//   }, false);




//2. Example of getting headers from file
// This can be improved and looked into more.
// response.headers has other methods then just foreach
var headers = function(url) {
  url = url || 'https://s3.amazonaws.com/offsync/img.jpg'
  var headersText = ''
  fetch(url).then(function (response) {
    response.headers.forEach(function(val, key) {
      headersText +=  key + ': ' + val + '\n'
    })
    document.getElementById('headers').innerText = headersText;
  })
}
headers()
