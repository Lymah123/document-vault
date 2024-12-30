// File encryption and decryption logic

const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// Encrypt file
const encryptFile = (filePath, destinationPath) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(destinationPath);

    input.pipe(cipher).pipe(output);

    return new Promise((resolve, reject) => {
        output.on("finish", () => resolve(destinationPath));
        output.on("error", reject);
    });
};

// Decrypt file
const decryptFile = (filePath, destinationPath) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(destinationPath);

    input.pipe(decipher).pipe(output);

    return new Promise((resolve, reject) => {
        output.on("finish", () => resolve(destinationPath));
        output.on("error", reject);
    });
};

module.exports = {
    encryptFile,
    decryptFile,
    key,
    iv,
};
