// var awsConfig = {
//   accessKeyId: 'AKIAJQCB3QZSVJ2RNU3A',
//   secretAccessKey: '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'
// };
//
// AWS.config.credentials = new AWS.WebIdentityCredentials({});
// AWS.config.update({accessKeyId: 'AKIAJQCB3QZSVJ2RNU3A', secretAccessKey: 'W6GxFjJaaOD2gNIUNSj8BbyaDxXLBW'});
//
// AWS.config.region = 'us-west-1';
// var s3 = new AWS.S3();


//0. Set up AWS cradentials

AWS.config.update({accessKeyId: '', secretAccessKey: ''});
AWS.config.update({region: 'us-west-1'});

var s3 = new AWS.S3({params: {Bucket: 'jsuploadbucket'}});





var fileChooser = document.getElementById('file-chooser');
var button = document.getElementById('upload-button');
var results = document.getElementById('results');
button.addEventListener('click', function() {
  var file = fileChooser.files[0];
  if (file) {
    results.innerHTML = '';

    var params = {
      Key: file.name,
      ContentType: file.type,
      Body: file
    };
    s3.upload(params, function (err, data) {
      results.innerHTML = err ? err : 'UPLOADED.';
      console.log(err, data);
    });
  } else {
    results.innerHTML = 'Nothing to upload.';
  }
}, false);




$("#fileUploadForm").submit(function() {
var fileChooser = document.getElementById('file');
var file = fileChooser.files[0];
if (file) {
var params = {Key: 'FILE_NAME', ContentType: file.type, Body: file};
s3.upload(params).on('httpUploadProgress', function(evt) {
console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
}).send(function(err, data) {
  console.log(err, data);
});
}
return false;
});



//
//
//
// //2. Example of getting headers from file
// // This can be improved and looked into more.
// // response.headers has other methods then just foreach
// var headers = function(url) {
//   url = url || 'https://s3.amazonaws.com/jsuploadbucket/img.jpg'
//   var headersText = ''
//   fetch(url).then(function (response) {
//     response.headers.forEach(function(val, key) {
//       headersText +=  key + ': ' + val + '\n'
//     })
//     document.getElementById('headers').innerText = headersText;
//   })
// }
// headers()
