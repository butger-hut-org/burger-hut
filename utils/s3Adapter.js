const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();
const logger = require("../middleware/logger");
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY, 
  secretAccessKey: process.env.S3_SECRET_KEY, 
  region: process.env.S3_REGION 
});

const s3 = new AWS.S3();

const uploadFile = (fileName,objectName) => {
  const fileContent = fs.readFileSync(fileName);

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: objectName, 
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      logger.error("Error uploading file:", err);
    } else {
      logger.info(`File uploaded successfully at ${data.Location}`);
    }
  });
};


const downloadObject = (objectName) => {
    const params = {
        Bucket: process.env.S3_BUCKET, 
        Key: objectName      
      };
      const downloadDirectory = './downloads'; 
      if (!fs.existsSync(downloadDirectory)) {
        fs.mkdirSync(downloadDirectory, { recursive: true });
    }
    const localFilePath = path.join(downloadDirectory, path.basename(params.Key));
    s3.getObject(params, (err, data) => {
        if (err) {
          logger.error('Error retrieving object from S3:', err);
        } else {
          // Save the file data to the local file system
          fs.writeFileSync(localFilePath, data.Body);
          logger.info(`File downloaded successfully to ${localFilePath}`);
        }
      })
};
module.exports = {uploadFile,downloadObject}