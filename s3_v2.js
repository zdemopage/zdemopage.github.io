// Initialize the S3 client
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: 'BUCKET_NAME' },
});

// Get the form and debug div elements
const form = document.getElementById('upload-form');
const debugDiv = document.getElementById('debug');

// Handle form submit event
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get the selected region and bucket name
  const region = document.getElementById('region-select').value;
  const bucketName = document.getElementById('bucket-input').value;

  // Set the S3 bucket params
  s3.config.update({ region });
  s3.config.params.Bucket = bucketName;

  // Get the file from the form input
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];

  // Set the file upload params
  const params = {
    Key: file.name,
    ContentType: file.type,
    Body: file,
  };

  // Make an unauthenticated request to the S3 bucket
  s3.makeUnauthenticatedRequest('putObject', params, (err, data) => {
    if (err) {
      debugDiv.innerHTML = `Error sending file: ${err.message}`;
      debugDiv.classList.add('has-content');
    } else {
      debugDiv.innerHTML = `File sent successfully: ${data.Location}`;
      debugDiv.classList.add('has-content');
    }
  });
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
