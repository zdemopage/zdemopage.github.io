// Initialize the S3 client
function uploadObject() {
  // Get the form and debug div elements
  const form = document.getElementById('upload-form');
  const debug = document.getElementById('debug');

  // Get the selected region and bucket name
  const aws_region = document.getElementById('region-select').value;
  const bucketName = document.getElementById('bucket').value;
  const reader = new FileReader();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  var fileContents;
  reader.readAsText(file);
  reader.onload = function() {
    fileContents = reader.result;
  }; 
  
  // Set the S3 bucket params
  //const AWS = window.AWS;
  //AWS.EventListeners.Core.removeListener('validate', AWS.EventListeners.Core.VALIDATE_PARAMETERS);
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    maxRetries: 15,
    region: aws_region,
    signRequest: false
  });
    
  const params = {
    Bucket: bucketName,
    Key: file.name,
    ContentType: file.type,
    Body: file,
    ACL: "public-read"
  };
  
  console.log("form: ", form);
  console.log("debug: ", debug);
  console.log("bucketName: ", bucketName);
  console.log("fileInput: ", fileInput);
  console.log("file: ", file);
  console.log("fileContents: ", file);
  console.log("s3: ", s3);
  console.log("params: ", params);

  // Make an unauthenticated request to the S3 bucket
  s3.makeUnauthenticatedRequest('putObject', params, function(err, data) {
    if (err) {
      debug.innerHTML = `Error sending file`;
      debug.classList.add('has-content');
      console.log(err, err.stack);
    } else {
      debug.innerHTML = `File sent successfully`;
      debug.classList.add('has-content');
      console.log("OK: ", data.Body);
    }
  });

  // Debug functionality
  s3.on('send', (data) => {
    console.log('Request: ', data.request);
    console.log('Response: ', data.response);
  });
}
