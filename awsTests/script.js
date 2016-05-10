
AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION
});

var s3 = new AWS.S3({params: {Bucket: config.AWS_BUCKET}});

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
      Body: file,
      Metadata: {
        'x-amz-meta-test': '??????'
      }
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
//   fetch(url).t                                                                                                                                                                      hen(function (response) {
//     response.headers.forEach(function(val, key) {
//       headersText +=  key + ': ' + val + '\n'
//     })
//     document.getElementById('headers').innerText = headersText;
//   })
// }
// headers()
