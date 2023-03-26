// Set AWS config
AWS.config.update({
	region: 'us-east-1'
});

// Create new S3 object
const s3 = new AWS.S3();

// Initialize variables
let region;
const regionSelect = document.getElementById('region-select');
const bucketInput = document.getElementById('bucket-input');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const sendButton = document.getElementById('send-button');
const statusDiv = document.getElementById('status');

// Add event listeners
regionSelect.addEventListener('change', (e) => {
	region = e.target.value;
});

uploadButton.addEventListener('click', () => {
	if (fileInput.files.length === 0) {
		alert('Please choose a file to upload.');
		return;
	}

	// Get file
	const file = fileInput.files[0];

	// Create a new S3 bucket object
	const params = { Bucket: bucketInput.value, Key: file.name, Body: file, ACL: 'public-read' };
	const bucket = new AWS.S3({ params, region });

	// Upload file to S3 bucket
	bucket.upload({}).makeUnauthenticatedRequest('putObject', params, (err, data) => {
		if (err) {
			statusDiv.innerText = `Error: ${err.message}`;
		} else {
			statusDiv.innerText = `File uploaded successfully.`;
		}
	});
});

sendButton.addEventListener('click', () => {
	if (!bucketInput.value) {
		alert('Please enter a bucket name.');
		return;
	}

	// Create a new S3 bucket object
	const params = { Bucket: bucketInput.value, Key: fileInput.files[0].name };
	const bucket = new AWS.S3({ params, region });

	// Get file from S3 bucket
	bucket.getObject((err, data) => {
		if (err) {
			statusDiv.innerText = `Error: ${err.message}`;
		} else {
			// Create a new S3 bucket object for the public bucket
			const publicBucketParams = { Bucket: 'public-bucket-name', Key: fileInput.files[0].name, Body: data.Body, ACL: 'public-read' };
			const publicBucket = new AWS.S3({ params: publicBucketParams, region });

			// Upload file to public S3 bucket
			publicBucket.upload({}).makeUnauthenticatedRequest('putObject', publicBucketParams, (err, data) => {
				if (err) {
					statusDiv.innerText = `Error: ${err.message}`;
				} else {
					statusDiv.innerText = `File sent to public S3 bucket successfully.`;
				}
			});
		}
	});
});
