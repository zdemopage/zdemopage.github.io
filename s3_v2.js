// Initialize the S3 client
function uploadObject() {
  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: "eu-west-1",
    signatureVersion: "v4",
    signRequest: false
  });

  // Get the form and debug div elements
  var form = document.getElementById('upload-form');
  var debug = document.getElementById('debug');

  // Get the selected region and bucket name
  const region = document.getElementById('region-select').value;
  const bucketName = document.getElementById('bucket').value;

  // Get the file from the form input
  var fileInput = document.getElementById('file-input');
  console.log("fileInput:", fileInput);
  
  var file = fileInput.files[0];
  console.log("file:", file);

  // Set the S3 bucket params
  s3.config.update({ region });
  var params = {
    Bucket: bucketName,
    Key: file.name,
    ContentType: file.type,
    Body: file,
    ACL: "public-read"
  };

  // Make an unauthenticated request to the S3 bucket
  s3.upload(params, function(err, data) {
    if (err) {
      debugDiv.innerHTML = `Error sending file: ${err.message}`;
      debugDiv.classList.add('has-content');
      console.log(err, err.stack);
    } else {
      debugDiv.innerHTML = `File sent successfully: ${data.Location}`;
      debugDiv.classList.add('has-content');
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
    if (debugDiv.classList.contains('has-content')) {
      debugDiv.style.display = 'block';
    }
  }, 1000);
}
