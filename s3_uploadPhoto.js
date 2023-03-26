// Import the required AWS SDK modules
const AWS = require('aws-sdk');
const fs = require('fs');

// Configure the AWS SDK
AWS.config.update({ region: 'eu-west-1' });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Set the bucket name and file path
const bucketName = 'uber';
const filePath = './index.html';

// Read the file content
const fileContent = fs.readFileSync(filePath);

// Set the parameters for the S3 upload
const params = {
    Bucket: bucketName,
    Key: 'index.html',
    Body: fileContent,
    ContentType: 'text/html',
    ACL: 'public-read'
};

// Upload the file to S3
s3.upload(params, function(err, data) {
    if (err) {
        console.log("Error uploading file: ", err);
    } else {
        console.log("File uploaded successfully. File location: ", data.Location);
    }
});
