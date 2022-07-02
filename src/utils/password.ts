import { pbkdf2Sync, randomBytes } from 'node:crypto';

export function verifyPassword(
  password: string,
  userHash: string,
  userSalt: string
): boolean {
  const generatedHash = pbkdf2Sync(
    password,
    userSalt,
    1000,
    2048,
    'sha256'
  ).toString('hex');

  return generatedHash === userHash;
}

export function createHashAndSalt(password: string): {
  hash: string;
  salt: string;
} {
  const salt = randomBytes(64).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 2048, 'sha256').toString('hex');

  return {
    hash,
    salt,
  };
}

createHashAndSalt('iqurpweorqpoiecwrompqw');
createHashAndSalt(';fdlskafds a;lfm');
createHashAndSalt('fdshalkmhwureowh,xoqie');
createHashAndSalt('12345678ikjr567');
