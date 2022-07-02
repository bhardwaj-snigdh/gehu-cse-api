import { Role, type User } from '@prisma/client';
import type { Handler } from 'express';
import { constants, HttpException } from '../utils';

const { RolePriority } = constants;

const canPublishNotice: Handler = (req, res, next) => {
  try {
    const user = req.user as User;
    const notice = req.notice;
    if (!notice) {
      throw new Error('Notice is undefined while checking authority');
    }

    if (user.role === Role.USER) {
      throw new HttpException(403, 'Unauthorised to publish noitces');
    }

    if (
      notice.audience.some(
        (audienceRole) => RolePriority[audienceRole] < RolePriority[user.role]
      )
    ) {
      throw new HttpException(403, 'Cannot publish noitce to higher authority');
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default canPublishNotice;
