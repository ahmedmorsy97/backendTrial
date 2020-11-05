import crypto from "crypto";

const ENCRYPTION_KEY = 'gZBpa"Hm{GgAx6?!Dp9uNP/5Pv=$Tj.a'; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    // eslint-disable-next-line no-undef
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  // eslint-disable-next-line no-undef
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (text) => {
  let textParts = text.split(":");
  // eslint-disable-next-line no-undef
  let iv = Buffer.from(textParts.shift(), "hex");
  // eslint-disable-next-line no-undef
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    // eslint-disable-next-line no-undef
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  // eslint-disable-next-line no-undef
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
