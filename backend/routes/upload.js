const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Document = require('../models/document');
const { uploadToS3, getFromS3, deleteFromS3 } = require('../utils/s3Operations');
const { encryptFile, decryptFile } = require('../utils/encryption');
const { sendDocumentNotification } = require('../services/emailService');
const { uploadDocument } = require("../controllers/documentController");
const authMiddleware = require("../middleware/authMiddleware");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    }
});

// Local storage setup
const LOCAL_STORAGE_DIR = path.join(__dirname, "../encrypted_files");
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

// Local file encryption
const encryptLocalFile = (buffer, encryptionKey) => {
    const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return encrypted;
};

// S3 Upload Route
router.post('/s3/upload', authMiddleware, async (req, res) => {
    try {
        const file = req.files.document;
        const encryptedFile = await encryptFile(file.data);
        const fileName = `${Date.now()}-${file.name}`;

        await uploadToS3(encryptedFile, fileName);

        const document = new Document({
            name: file.name,
            s3Key: fileName,
            userId: req.user._id
        });
        await document.save();

        await sendDocumentNotification(req.user.email, 'upload', file.name);
        res.status(200).json({ message: 'Document uploaded successfully', document });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading document' });
    }
});

// Local Upload Route
router.post("/local/upload", authMiddleware, upload.single("file"), uploadDocument);

// List Files Route
router.get("/files", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const userDir = path.join(LOCAL_STORAGE_DIR, userId);

        if (!fs.existsSync(userDir)) {
            return res.status(200).json({ files: [] });
        }

        const files = fs.readdirSync(userDir).map((fileName) => ({
            fileName,
            path: path.join(userDir, fileName),
            uploadDate: fs.statSync(path.join(userDir, fileName)).mtime
        }));

        res.status(200).json({ files });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving files" });
    }
});

// Download S3 File Route
router.get('/s3/:id', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        const s3File = await getFromS3(document.s3Key);
        const decryptedFile = await decryptFile(s3File.Body);
        res.send(decryptedFile);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving document' });
    }
});

// Download Local File Route
router.get("/local/:fileName", authMiddleware, async (req, res) => {
    try {
        const { fileName } = req.params;
        const userId = req.user.id;
        const encryptionKey = process.env.ENCRYPTION_KEY || "default_encryption_key";
        const filePath = path.join(LOCAL_STORAGE_DIR, userId, fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        const encryptedFile = fs.readFileSync(filePath);
        const decipher = crypto.createDecipher("aes-256-cbc", encryptionKey);
        const decryptedFile = Buffer.concat([
            decipher.update(encryptedFile),
            decipher.final(),
        ]);

        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.send(decryptedFile);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving file" });
    }
});

// Delete S3 File Route
router.delete('/s3/:id', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        await deleteFromS3(document.s3Key);
        await document.remove();
        await sendDocumentNotification(req.user.email, 'delete', document.name);
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document' });
    }
});

// Delete Local File Route
router.delete("/local/:fileName", authMiddleware, async (req, res) => {
    try {
        const { fileName } = req.params;
        const userId = req.user.id;
        const filePath = path.join(LOCAL_STORAGE_DIR, userId, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.status(200).json({ message: "File deleted successfully" });
        } else {
            res.status(404).json({ message: "File not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting file" });
    }
});

module.exports = router;
