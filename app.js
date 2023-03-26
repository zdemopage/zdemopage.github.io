document.addEventListener('DOMContentLoaded', function() {
  // Load AWS SDK
  var script = document.createElement('script');
  script.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.103.0.min.js';
  document.head.appendChild(script);

  // Initialize AWS SDK once it has finished loading
  script.onload = function() {
    AWS.config.region = 'us-west-2'; // Set default region
    var s3 = new AWS.S3();

    // Upload file to S3 bucket
    function uploadFile() {
      var bucketName = document.getElementById('bucketName').value;
      var file = document.getElementById('file').files[0];

      // Ensure that a file was selected
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      // Construct S3 upload parameters
      var params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file,
        ACL: 'public-read'
      };

      // Perform S3 upload
      s3.makeUnauthenticatedRequest('putObject', params, function(err, data) {
        if (err) {
          document.getElementById('debug').innerHTML = 'Error uploading file: ' + err;
          return;
        }
        document.getElementById('debug').innerHTML = 'File uploaded successfully!';
      });
    }

    // Attach event listener to upload button
    document.getElementById('uploadButton').addEventListener('click', uploadFile);
  };
});
