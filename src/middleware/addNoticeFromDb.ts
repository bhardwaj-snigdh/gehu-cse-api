import type { Handler } from 'express';
import prisma from '../config/database';
import { HttpException } from '../utils';

const addNoticeFromDb: Handler = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const notice = await prisma.notice.findUnique({
      where: {
        id: Number(noticeId),
      },
    });
    if (!notice) {
      throw new HttpException(404, 'Notice not found');
    }

    req.notice = notice;
    next();
  } catch (err) {
    next(err);
  }
};

export default addNoticeFromDb;
