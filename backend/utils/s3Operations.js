const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3Config");

const uploadToS3 = async (file, fileName) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file,
  });
  return await s3.send(command);
};

const getFromS3 = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  });
  return await s3.send(command);
};

const deleteFromS3 = async (fileName) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  });
  return await s3.send(command);
};

module.exports = {
  uploadToS3,
  getFromS3,
  deleteFromS3
};
