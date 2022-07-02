import { Role, type Notice, type User } from '@prisma/client';
import { Router } from 'express';
import passport from 'passport';
import prisma from '../config/database';
import {
  addNoticeFromDb,
  addNoticeIfValidated,
  canPublishNotice,
} from '../middleware';
import { HttpException, JsonResponse } from '../utils';

const router = Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res, next) => {
  try {
    const userRole = (req.user as User)?.role ?? Role.USER;
    const notices = await prisma.notice.findMany({
      where: {
        audience: {
          has: userRole,
        },
      },
      include: {
        issuer: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(new JsonResponse({ notices }));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  addNoticeIfValidated,
  canPublishNotice,
  async (req, res, next) => {
    try {
      const notice = req.notice as Notice;
      const issuingUser = req.user as User;
      const publishedNotice = await prisma.notice.create({
        data: {
          body: notice.body,
          title: notice.title,
          audience: notice.audience,
          issuerId: issuingUser.id,
        },
        include: {
          issuer: {
            select: {
              name: true,
            },
          },
        },
      });

      res.send(new JsonResponse({ notice: publishedNotice }));
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:noticeId', addNoticeFromDb, (req, res, next) => {
  try {
    const userRole = (req.user as User)?.role ?? Role.USER;
    const notice = req.notice as Notice;

    if (notice.audience.includes(userRole) || userRole === Role.ADMIN) {
      res.json(new JsonResponse({ notice }));
    } else {
      throw new HttpException(403, 'Not authorised to view this notice');
    }
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/:noticeId',
  addNoticeFromDb,
  canPublishNotice,
  async (req, res, next) => {
    try {
      const { body } = req.body;
      const notice = req.notice as Notice;
      const editor = req.user as User;
      if (editor.role !== Role.ADMIN && notice.issuerId !== editor.id) {
        throw new HttpException(
          403,
          'Only notice issuer or admin can edit a notice'
        );
      }

      const editedNotice = await prisma.notice.update({
        where: {
          id: notice.id,
        },
        data: {
          body,
        },
        include: {
          issuer: {
            select: {
              name: true,
            },
          },
        },
      });

      res.json(new JsonResponse({ notice: editedNotice }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
