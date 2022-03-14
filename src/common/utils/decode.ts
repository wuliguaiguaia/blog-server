import * as bcrypt from 'bcrypt';
import { saltOrRounds } from '../constants';
/* saltOrRounds: 生成salt的迭代次数 */

export const encodePass = (pass) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(saltOrRounds, function (err, salt) {
      bcrypt.hash(pass, salt, function (err, hash) {
        if (err) {
          reject(false);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePass = (originPass, pass) => {
  return bcrypt.compareSync(originPass, pass);
};

/* const iv = randomBytes(16);
const password = 'Password used to generate key';

// The key length is dependent on the algorithm.
// In this case for aes256, it is 32 bytes.
const key = scryptSync(password, 'salt', 32) as Buffer;

export const aesEncrypt = (textToEncrypt) => {
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);
  return encryptedText.toString('hex');
};

export const aesDecrypt = (encryptedText) => {
  encryptedText = Buffer.from(encryptedText, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decryptedText.toString();
}; */
