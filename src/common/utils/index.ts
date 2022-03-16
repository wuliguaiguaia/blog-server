import * as crypto from 'crypto';

export const md5 = (buffer) => {
  const hash = crypto.createHash('md5');
  hash.update(buffer, 'utf8');
  const md5 = hash.digest('hex');
  return md5;
};
