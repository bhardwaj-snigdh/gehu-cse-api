import { generateKeyPairSync } from 'node:crypto';
import { writeFileSync } from 'fs';
import path from 'path';

const privateKeyPath = path.join(__dirname, 'id_rsa_priv.pem');
const publicKeyPath = path.join(__dirname, 'id_rsa_pub.pem');

function main() {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
  });

  const privateKeyBuffer = privateKey.export({ format: 'pem', type: 'pkcs1' });
  const publicKeyBuffer = publicKey.export({ format: 'pem', type: 'pkcs1' });

  writeFileSync(privateKeyPath, privateKeyBuffer, 'utf-8');
  writeFileSync(publicKeyPath, publicKeyBuffer, 'utf-8');
  console.log('Key generation done.');
  console.log(`Private Key: ${privateKeyPath}`);
  console.log(`Public Key: ${publicKeyPath}`);
}

main();
