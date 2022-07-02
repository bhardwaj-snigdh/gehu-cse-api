import { Role } from '@prisma/client';
import path from 'node:path';
import { readFileSync } from 'node:fs';

export const privateKeyPath = path.join(
  __dirname,
  '..',
  '..',
  'id_rsa_priv.pem'
);
export const PRIVATE_KEY = readFileSync(privateKeyPath, 'utf-8');

export const publicKeyPath = path.join(__dirname, '..', '..', 'id_rsa_pub.pem');
export const PUBLIC_KEY = readFileSync(privateKeyPath, 'utf-8');

/**
 * Expiry time based on user's role, keyed by Role enum
 */
export const roleBasedExpiryTime = {
  [Role.ADMIN]: '30min',
  [Role.HOD]: '1d',
  [Role.FACULTY]: '3d',
  [Role.USER]: '15d',
} as const;

export const RolePriority = {
  [Role.ADMIN]: 0,
  [Role.HOD]: 1,
  [Role.FACULTY]: 2,
  [Role.USER]: 3,
} as const;
