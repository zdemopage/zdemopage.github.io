// Initialize AWS SDK
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Get form elements
const regionSelect = document.getElementById('region');
const bucketInput = document.getElementById('bucket');
const fileInput = document.getElementById('file');
const uploadButton = document.getElementById('upload-btn');
const sendButton = document.getElementById('send-btn');
const statusDiv = document.getElementById('status');

// Set default region
let region = regionSelect.value;

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
	bucket.upload({}, (err, data) => {
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
			publicBucket.upload({}, (err, data) => {
				if (err) {
					statusDiv.innerText = `Error: ${err.message}`;
				} else {
					statusDiv.innerText = `File sent to public S3 bucket successfully.`;
				}
			});
		}
	});
});
