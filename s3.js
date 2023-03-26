const regionSelector = document.getElementById('region-selector');
const bucketNameInput = document.getElementById('bucket-name');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const sendButton = document.getElementById('send-button');
const debugDiv = document.getElementById('debug');

let selectedRegion;

// Set up the SDK configuration
const config = new AWS.Config({
  region: 'us-west-2',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

// Create an S3 client object
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: '' },
});

// Update the selected region when the region selector changes
regionSelector.addEventListener('change', () => {
  selectedRegion = regionSelector.value;
});

// Upload the file to the S3 bucket when the upload button is clicked
uploadButton.addEventListener('click', () => {
  const file = fileInput.files[0];
  const fileName = file.name;
  const fileSize = file.size;
  const fileType = file.type;

  if (!file) {
    alert('Please select a file to upload');
    return;
  }

  if (!selectedRegion) {
    alert('Please select a region');
    return;
  }

  if (!bucketNameInput.value) {
    alert('Please enter a bucket name');
    return;
  }

  // Set up the SDK configuration with the selected region
  config.update({
    region: selectedRegion,
  });

  // Create an S3 client object with the updated config
  s3.config.update({
    region: selectedRegion,
  });

  s3.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '',
  });

  // Set the bucket name parameter
  s3.config.params.Bucket = bucketNameInput.value;

  // Create a unique ID for the object key
  const key = `uploads/${Date.now()}-${fileName}`;

  // Set up the S3 object parameters
  const params = {
    Key: key,
    ContentType: fileType,
    Body: file,
    ACL: 'public-read',
  };

  // Upload the file to the S3 bucket
  s3.upload(params, (err, data) => {
    if (err) {
      debugDiv.innerHTML = `Error uploading file: ${err.message}`;
      debugDiv.classList.add('has-content');
    } else {
      debugDiv.innerHTML = `File uploaded successfully: ${data.Location}`;
      debugDiv.classList.add('has-content');
      sendButton.disabled = false;
    }
  });
});

// Send the file to the public S3 bucket when the send button is clicked
sendButton.addEventListener('click', () => {
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file to send');
    return;
  }

  // Create a unique ID for the object key
  const key = `uploads/${Date.now()}-${file.name}`;

  // Set up the S3 object parameters
  const params = {
    Key: key,
    ContentType: file.type,
    Body: file,
    ACL: 'public-read',
  };

  // Make an unauthenticated request to the public S3 bucket
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
