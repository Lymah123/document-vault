const Document = require("../models/document");
const User = require("../models/user");
const { encryptFile } = require("../utils/cryptoUtils");
const { uploadFileToS3 } = require("../config/s3Config");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { sendDocumentNotification } = require("../services/emailService");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Upload a Document
exports.uploadDocument = async (req, res) => {
  try {
    const { folder = "root", tags = [], uploadedBy } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const s3Upload = await s3.upload(params).promise();

    const metadata = {
      fileSize: file.size,
      uploadDate: new Date(),
      uploadedBy,
    };

    const document = new Document({
      name: file.originalname,
      folder,
      tags,
      metadata,
      fileUrl: s3Upload.Location,
      s3Key: fileName
    });

    const savedDocument = await document.save();

    await User.findByIdAndUpdate(uploadedBy, {
      $push: { documents: savedDocument._id },
    });

    await sendDocumentNotification(user.email, "upload", document.name);

    res.status(201).json({
      message: "Document uploaded successfully",
      document: savedDocument
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while uploading the document", error: error.message });
  }
};

// Document deletion endpoint
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: document.s3Key
    };
    await s3.deleteObject(params).promise();

    await User.findByIdAndUpdate(userId, {
      $pull: { documents: documentId }
    });

    await sendDocumentNotification(user.email, "delete", document.name);

    await Document.findByIdAndDelete(documentId);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting the document", error: error.message });
  }
};
