// Initialize the S3 client
function uploadObject() {
  // Get the form and debug div elements
  var form = document.getElementById('upload-form');
  var debug = document.getElementById('debug');

  // Get the selected region and bucket name
  var aws_region = document.getElementById('region-select').value;
  var bucketName = document.getElementById('bucket').value;

  // Get the file from the form input
  var fileInput = document.getElementById("fileInput");
  console.log("fileInput:", fileInput);
  
  var file = fileInput.files[0];
  console.log("file:", file);

  // Set the S3 bucket params
  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: "v4",
    region: aws_region,
    maxRetries: 15,
    signRequest: false
  });
  
  var params = {
    Bucket: bucketName,
    Key: file.name,
    ContentType: file.type,
    Body: file,
    ACL: "public-read"
  };

  // Make an unauthenticated request to the S3 bucket
  s3.makeUnauthenticatedRequest(params, function(err, data) {
    if (err) {
      debug.innerHTML = `Error sending file`;
      debug.classList.add('has-content');
      console.log(err, err.stack);
    } else {
      debug.innerHTML = `File sent successfully`;
      debug.classList.add('has-content');
      console.log("File sent successfully to: ", data.Location);
    }
  });

  // Debug functionality
  s3.on('send', (data) => {
    console.log('Request:', data.request);
    console.log('Response:', data.response);
  });

  // Show the debug div if it has content
  setInterval(() => {
    if (debug.classList.contains('has-content')) {
      debug.style.display = 'block';
    }
  }, 1000);
}
