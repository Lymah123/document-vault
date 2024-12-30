const CryptoJS = require("crypto-js");

const encryptFile = (file, secretKey) => {
  return CryptoJS.AES.encrypt(file, secretKey).toString();
}

const decryptFile = (encryptedFile, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedFile, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptFile,
  decryptFile
};
