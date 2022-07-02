import type { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY, roleBasedExpiryTime } from './constants';

export default function issueJWT(user: User) {
  const payload = {
    sub: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: roleBasedExpiryTime[user.role],
  });

  return token;
}
