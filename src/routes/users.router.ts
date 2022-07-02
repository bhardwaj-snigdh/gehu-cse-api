import type { User } from '@prisma/client';
import { Router } from 'express';
import prisma from '../config/database';
import { createHashAndSalt, verifyPassword } from '../utils/password';
import { HttpException, issueJWT, JsonResponse } from '../utils';
import { validateUserDetails } from '../middleware';

const router = Router();

const filterUserToSend = ({
  email,
  id,
  name,
  phone,
  role,
}: User): Omit<User, 'hash' | 'salt'> => {
  return { email, id, name, phone, role };
};

router.post('/login', validateUserDetails('login'), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new HttpException(401, 'User not found'));
    }
    if (!verifyPassword(password, user.hash, user.salt)) {
      return next(new HttpException(401, 'Invalid password'));
    }

    const jwtToken = issueJWT(user);
    res.json(
      new JsonResponse({ user: filterUserToSend(user), token: jwtToken })
    );
  } catch (err) {
    next(err);
  }
});

router.post(
  '/register',
  validateUserDetails('register'),
  async (req, res, next) => {
    try {
      const { email, name, phone, password } = req.body;
      const { hash, salt } = createHashAndSalt(password);
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          phone,
          hash,
          salt,
        },
      });

      const jwtToken = issueJWT(newUser);

      res.json(
        new JsonResponse({ user: filterUserToSend(newUser), token: jwtToken })
      );
    } catch (err) {
      next(err);
    }
  }
);

export default router;
